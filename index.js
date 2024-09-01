import express from "express";
import { createServer } from "node:http";
import preprocessingRoutes from "./plagiarism/preprocessing.js";
import mongoose from "mongoose";
import "dotenv/config.js";

import passport from "passport";
import Student from "./Model/Student.js";
import Teacher from "./Model/Teacher.js";
import authRoutes from "./routes/auth.js";
import assignmentRoutes from "./routes/assignment.js";
import subjectRoutes from "./routes/subject.js";
import settingRoutes from "./routes/setting.js";
import dashboardRoutes from "./routes/dashboard.js";
import path from "path";
import messageRoutes from "./routes/message.js";
import json from "jsonwebtoken";
import cors from "cors";

import { Server } from "socket.io";
import { Strategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";

import initilize_socket from "./server_socket.js";
import connect_to_db from "./connect_to_db.js";

const app = express();
app.use(cors({}));
connect_to_db();

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.secretKey;

passport.use(
  new Strategy(opts, async function (jwt_payload, done) {
    try {
      let user;

      if (jwt_payload.userType == "Student") {
        user = await Student.findOne({ _id: jwt_payload.identifier });
      } else if (jwt_payload.userType == "Teacher") {
        user = await Teacher.findOne({ _id: jwt_payload.identifier });
      }

      if (user) {
        return done(null, { user: user, type: jwt_payload.userType });
      } else {
        // Create a new user based on the JWT payload
        const newUser =
          jwt_payload.userType == "Student"
            ? new Student({
                id: jwt_payload.identifier,
              })
            : new Teacher({
                id: jwt_payload.identifier,
              });

        // Save the new user to the database
        const savedUser = await newUser.save();

        // Return the newly created user
        return done(null, savedUser);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

const server = createServer(app);

initilize_socket(server);
app.get("/test" , (req,res) => {
  res.send("working")
})

app.use("/pdf" , express.static("pdf"))
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/preprocessing", preprocessingRoutes);
app.use("/assignment", assignmentRoutes);
app.use("/subject", subjectRoutes);
app.use("/setting", settingRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/message", messageRoutes);

server.listen(process.env.PORT, () => {
  console.log("server started at port:", process.env.PORT);
});
