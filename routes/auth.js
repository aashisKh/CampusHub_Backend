import express from "express";
let router = express.Router();
import getToken from "../utils/helper.js";
import bcrypt from "bcrypt";
import DB from "../SCHOOLDB/schoolDB.json" assert { type: "json" };
import NepaliDate from "nepali-datetime";
import subDB from "../SCHOOLDB/subject_db.json" assert { type: "json" };
import TeacherModel from "../Model/Teacher.js";
import StudentModel from "../Model/Student.js";
import OtpModel from "../Model/Otp.js";
import Group_Model from "../Model/Group.js";
import {
  sendEmail,
  otpAuthenticate,
  otpVerify,
} from "../utils/otpVerification.js";
// import { isArrowFunction } from "typescript";

const semCalculate = (batch) => {
  const now = new NepaliDate();
  const formattedDate = now.format("YYYY-MM-DD");

  const year = formattedDate.split("-");

  const cal1 = parseInt(year[0]);
  const month = year[1];
  const batch1 = parseInt(batch);
  const diff = cal1 - batch1;

  for (let i = 1; i <= 4; i++) {
    if (diff == i) {
      if (month < 6) {
        return { year: diff.toString(), sem: 0 };
      } else {
        return { year: diff.toString(), sem: 1 };
      }
    }
  }
  if (diff > 4 || diff < 1) {
    return "Invalid batch";
  }
};

router.post("/register/teacher", async (req, res) => {
  const { Tid, username, password } = req.body;
  global.id = Tid;
  global.username = username;
  global.password = password;

  const data = DB.Teachers.filter((value) => {
    if (value.id == Tid) {
      return value;
    }
  });
  if (data.length==0) {
    res.status(400).json({ error: "Invalid Id" });
  }
else{
  const { name, email, phone, subject, address } = data[0];
  const teacher = await TeacherModel.findOne({ id: Tid });
  if (teacher) {
    return res
      .status(401)
      .json({ error: "A teacher with same id already exists" });
  }

  //OTP verification
  await sendEmail(email);

  return res.status(200).json({ message: "Successfully verified !!" });
}
  
});

router.post("/register/otp", async (req, res) => {
  const { value } = req.body;
  // console.log(global.id);

  if (global.id[0] == "T") {
    const data = DB.Teachers.filter((value) => {
      if (value.id == global.id) {
        return value;
      }
    });
    if (!data) {
      res.status(400).json({ error: "Invalid Id" });
    }

    const { name, email, phone, subject, address, id } = data[0];

    const user = await OtpModel.findOne({ value: value });
    if (user) {
      const del = await OtpModel.findOneAndDelete({ value: value });

      const hashedPassword = await bcrypt.hash(global.password, 10);
      const newUsername = global.username;

      const newTeacherData = {
        id: id,
        username: newUsername,
        t_name: name,
        address,
        phone,
        subjects : subject,
        password: hashedPassword,
        email,
      };

      const TeacherData = await TeacherModel.create(newTeacherData);
      const token = await getToken("Teacher", TeacherData);
      const userToReturn = { ...TeacherData.toJSON(), token };
      delete userToReturn.password;
      res.status(200).json(userToReturn);
    } else {
      res.status(403).json({ error: "Wrong OTP detected" });
    }
  }
  
   else {
    const data = DB.Students.filter((value) => {
      if (value.id == global.id) {
        return value;
      }
    });
    if (!data) {
      res.status(400).json({ error: "Invalid Id" });
    }
    // console.log(data[0]);
    const { name, email, phone, batch, address, id } = data[0];
    let subject1;
    const sem = semCalculate(batch);

    // console.log("sem:", sem);
    const subject = subDB[sem.year];
    // console.log(subject);
    const sem1 = Object.keys(subject);
    if (sem.sem == 0) {
      subject1 = subject[sem1[sem.sem]];
    } else if (sem.sem == 1) {
      subject1 = subject[sem1[sem.sem]];
    } else {
      res.status(404).json({ error: "Semester not found" });
    }
    const user_otp = await OtpModel.findOne({ value: value });
    if (user_otp) {
     const is_deleted_otp =  await OtpModel.findOneAndDelete({ value: value });
     if(is_deleted_otp._id){
      const hashedPassword = await bcrypt.hash(password, 10);
      const newStudentData = {
        id: id,
        username,
        s_name: name,
        address,
        batch,
        password: hashedPassword,
        email,
        subjects: subject1,
      };

      const StudentData = await StudentModel.create(newStudentData);
      // console.log("register student check" , StudentData)
      const token = await getToken("Student", StudentData);
      const userToReturn = { ...StudentData.toJSON(), token };
      delete userToReturn.password;

     const added_new_student_to_group =  await Group_Model.updateMany(
        {subject : {$in : StudentData.subjects}},
        { $push: { collaborators: (StudentData._id).toString() } }
        )
        // console.log("added_new_student_to_group" , added_new_student_to_group)
      return res.status(200).json(userToReturn);
    }  }
    else {
      res.status(405).json({ error: "OTP doesnot match" });
    }
  }
});

router.post("/register/student", async (req, res) => {
  const { Sid, username, password } = req.body;
  global.id = Sid;
  global.username = username;
  global.password = password;

  const data = DB.Students.filter((value) => {
    if (value.id == Sid) {
      return value;
    }
    
  });
  // console.log(data)
  if (data.length==0) {
    res.status(400).json({ error: "Invalid Id" });
  }
  else{
    const { name, email, phone, batch, address } = data[0];
  const student = await StudentModel.findOne({ id: Sid });
  if (student) {
    return res
      .status(401)
      .json({ error: "A student with same id already exists" });
  }

  //OTP verification
  await sendEmail(email);

  return res.status(200).json({ message: "Successfully verified !!" });
  }
});

router.post("/login/teacher", async (req, res) => {
  const { username, password } = req.body;
  const user = await TeacherModel.findOne({ username: username });
  if (!user) {
    return res.status(403).json({ err: "Invalid credentials" });
  }

  global.id = user.id;

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(403).json({ err: "Invalid credentials" });
  }

  await sendEmail(user.email);

  res.json({ message: "Successful password login!!" });
});

router.post("/login/student", async (req, res) => {
  const { username, password } = req.body;
  const user = await StudentModel.findOne({ username: username });
  if (!user) {
    return res.status(403).json({ err: "Invalid credentials" });
  }

  global.id = user.id;

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(403).json({ err: "Invalid credentials" });
  }

  await sendEmail(user.email);

  res.json({ message: "Successful password login!!" });
});

router.post("/login/otp", async (req, res) => {
  const { value } = req.body;

  const user = await OtpModel.findOne({ value: value });
  
  if (!user) {
    res.status(403).json({ err: "Otp doesnot matches!!" });
  } else {
    const del = await OtpModel.findOneAndDelete({ value: value });

    if (global.id[0] == "T") {
      const data = await TeacherModel.findOne({ id: global.id });
      const token = await getToken("Teacher", data);
      // console.log(token);
      const userToReturn = { ...data.toJSON(), token };

      delete userToReturn.password;
      return res.status(200).json(userToReturn);
    } else {
      const data = await StudentModel.findOne({ id: global.id });
      const token = await getToken("Student", data);
      // console.log(token);
      const userToReturn = { ...data.toJSON(), token };
      delete userToReturn.password;
      return res.status(200).json(userToReturn);
    }
  }
});

export default router;
