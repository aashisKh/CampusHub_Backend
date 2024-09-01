import mongoose from "mongoose";

const Student = new mongoose.Schema({
  id: { type: String, require: true },
  username: { type: String, require: true },
  password: { type: String, require: true },
  email: { type: String, require: true },
  s_name: { type: String },
  batch: { type: String, require: true },
  subjects: { type: [String], require: true },
  assignments: [
    { type: mongoose.Types.ObjectId, ref: "Assignment" },
    { created_date: Date },
  ],
});

const Student_Modal = mongoose.model("Student", Student);

export default Student_Modal;
