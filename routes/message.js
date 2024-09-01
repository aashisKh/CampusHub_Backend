import express from "express";
import "dotenv/config";
import passport from "passport";
let router = express.Router();
import Group from "../Model/Group.js";
import Teacher_Modal from "../Model/Teacher.js";
import Student_Model from "../Model/Student.js";
import groupchatmsg from "../Model/Group_chat_messages.js";

import Otp_Model from "../Model/Otp.js";
import TokenizeData_Model from "../Model/Tokenizedata.js"
import Submitted_Assignment_Modal from "../Model/Submitted_Assignment.js";
import Assignment_Model from "../Model/Assignment.js";
import fs from "fs"
import path from "path"
import { PdfReader } from "pdfreader";

import * as pdfjsLib from 'pdfjs-dist';

router.post(
  "/creategroup",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { subjectName, groupName } = req.body;
    const type = req.user.type;
    const id = req.user.user._id;
    if (type == "Teacher") {
      const data = await Teacher_Modal.findOne({ _id: id });
      if (!data) {
        res.json({ err: "Teacher is not found" });
      } else {
        const subject = data.subjects.includes(subjectName);

        if (subject === false) {
          res.json({ msg: "You are not allowed to create this group" });
        } else {
          const checkgroup = await Group.findOne({ subject: subjectName });

          if (checkgroup) {
            res.json({ err: "Already exist" });
          } else {
            const list = await Student_Model.find({ subjects: subjectName });
            const students = list.map((student) => student._id.toString());

            const newdata = {
              subject: subjectName,
              name: groupName,
              teacher: id,
              collaborators: students,
            };
            const result = await Group.create(newdata);
            res.json(result);
          }
        }
      }
    } else {
      res.json({ err: "Not Allowed" });
    }
  }
);

router.get(
  "/group",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const type = req.user.type;
    const id = req.user.user._id;

    if (type == "Teacher") {
      const groups = await Group.find({ teacher: id });
      res.status(200).json(groups);
    } else if (type == "Student") {
      const groups = await Group.find({ collaborators: id });
      res.status(200).json(groups);
    } else {
      res.json({ err: "Invalid" });
    }
  }
);

// test purpose


router.get("/get_all_groups", async (req, res) => {


  const g = await Group.find({ })
  .populate({
    path: "collaborators",
    select: "_id s_name"
  })
  .populate({
    path: "teacher",select : "_id t_name"
  });

res.json(g);

});

//test purpose
router.get("/getteacher", async (req, res) => {
  const data = await Teacher_Modal.findOne({ _id: "659bb9dc920177f731a30acd" });

  res.json(data);
});

router.post(
  "/savemessage",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { subjectName, message } = req.body;
    const group = await Group.findOne({ subject: subjectName });

    const id = req.user.user._id;
    const type = req.user.type;
    const findmsg = await groupchatmsg.findOne({ group: group._id });
    if (findmsg) {
      const result = await groupchatmsg.findOneAndUpdate(
        { group: group._id },
        {
          $push: {
            messages: {
              from: id,
              model_type: type,
              message,
            },
          },
        },
        { new: true }
      );
      const new_added_data = result.messages[result.messages.length - 1];
      res.json(new_added_data);
    } else {
      const result = await groupchatmsg.create({
        group: group._id,

        messages: {
          from: id,
          model_type: type,
          message,
        },
      });
      // console.log("message is createed");
      res.json(result);
    }
  }
);

router.post(
  "/getmessage",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const id = req.user.user._id;
    const { subjectName } = req.body;
    const group = await Group.findOne({ subject: subjectName });

    const chatmsg = await groupchatmsg.findOne(
      { group: group._id },
      { _id: 0, __v: 0 }
    );
    if (chatmsg != null) {
      const filtered_chat_messages = chatmsg.messages.map((message) => {
        const temp_message = {};
        if (message.from.toString() === id.toString()) {
          temp_message.self = true;
        } else {
          temp_message.self = false;
        }
        temp_message.message = message.message;
        return temp_message;
      });
      res.json(filtered_chat_messages);
    }
  }
);

router.get("/group_members/:subject_name",
  passport.authenticate("jwt",
 { session: false }), 
 async (req , res) =>{
  const {subject_name} = req.params
  const type =   req.user.type
  const group_members = await Group.find({ subject: subject_name})
  .populate({
    path: "collaborators",
    select: "_id s_name"
  })
  .populate({
    path: "teacher",select : "_id t_name"
  });
  
  let is_admin = false
  if(type === "Teacher"){
    is_admin = true
  }

  const group_members_data = {
    admin : is_admin,
    members : group_members
  }
console.log(group_members_data)
res.json(group_members_data);
})


export default router;
