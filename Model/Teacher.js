import mongoose from "mongoose";

const Teacher = new mongoose.Schema({
  id: { type: String, require: true },
  username: { type: String, require: true },
  password: { type: String, require: true },
  email: { type: String, require: true },
  t_name: { type: String },
  phone: { type: String },
  address: { type: String },
  subjects: { type: [String], require: true },
});

const Teacher_Modal = mongoose.model("Teacher", Teacher);

export default Teacher_Modal;
