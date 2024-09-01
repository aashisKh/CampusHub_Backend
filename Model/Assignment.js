import mongoose from "mongoose";

const Assignment = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },

  title: { type: String },
  description: { type: String },
  deadline: { type: String },
  subject: { type: String },
});

const Assignment_Model = mongoose.model("Assignment", Assignment);
export default Assignment_Model;
