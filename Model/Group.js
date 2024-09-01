import mongoose from "mongoose";

const Group = new mongoose.Schema({
  subject: String,
  name: String,
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
  collaborators: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
});

const Group_Modal = mongoose.model("Group", Group);

export default Group_Modal;
