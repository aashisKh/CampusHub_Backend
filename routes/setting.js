import express from "express";
let router = express.Router();
import studentModel from "../Model/Student.js";
import teacherModel from "../Model/Teacher.js";
import passport from "passport";
import bcrypt from "bcrypt";
router.post(
  "/changeUsername",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { username } = req.body;

    const id = req.user.user._id;
    const type = req.user.type;
    console.log(id);

    if (type == "Teacher") {
      const update = await teacherModel.findByIdAndUpdate(
        { _id: id },
        { username: username },
        { new: true }
      );
      res.json(update);
    } else if (type == "Student") {
      const update = await studentModel.findByIdAndUpdate(
        id,
        { username: username },
        { new: true }
      );

      res.json(update);
    } else {
      res.status(404).json({ err: "user not found" });
    }
  }
);

router.post(
  "/changePassword",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { oldpassword, newpassword } = req.body;

    const id = req.user.user._id;
    const type = req.user.type;

    // console.log(id);

    if (type == "Teacher") {
      const dbData = await teacherModel.findOne({
        _id: id,
      });
      const status = bcrypt.compare(oldpassword, dbData.password);
      if (!status) {
        return res.status(403).json({ err: "Invalid credentials" });
      }

      const newhashedPassword = await bcrypt.hash(newpassword, 10);

      const update = await teacherModel.findByIdAndUpdate(
        { _id: id },
        { password: newhashedPassword },
        { new: true }
      );
      res.status(202).json(update);
    } else if (type == "Student") {
      const dbData = await studentModel.findOne({
        _id: id,
      });
      const status = bcrypt.compare(oldpassword, dbData.password);
      if (!status) {
        return res.status(403).json({ err: "Invalid credentials" });
      }

      const newhashedPassword = await bcrypt.hash(newpassword, 10);
      const update = await studentModel.findByIdAndUpdate(
        id,
        { password: newhashedPassword },
        { new: true }
      );

      res.status(202).json(update);
    } else {
      res.status(404).json({ err: "user not found" });
    }
  }
);

export default router;
