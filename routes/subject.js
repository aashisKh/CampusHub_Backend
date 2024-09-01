import express from "express";
let router = express.Router();

import studentModel from "../Model/Student.js";
import assignmentModel from "../Model/Assignment.js";
import pkg from "body-parser";
import passport from "passport";
const { json } = pkg;

router.get(
  "/mysubjectDashboard",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const id = req.user.user._id;


    const subject = await studentModel.findOne({ _id: id });

    res.json(subject.subjects);
  }
);

export default router;
