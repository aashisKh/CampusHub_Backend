import mongoose from "mongoose";

const Group_Chat = new mongoose.Schema({
  t_id: {
    type: mongoose.Types.ObjectId,
    ref: "Teacher",
  },
  collaborators: {
    type: [String],
  },
});

const Group_Chat_Modal = mongoose.model("Group_Chat", Group_Chat);

export default Group_Chat_Modal;
