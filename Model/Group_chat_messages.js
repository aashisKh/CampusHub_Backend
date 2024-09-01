import mongoose from "mongoose";

const Group_chat_message = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
  },
  messages: [
    {
      from: { type: mongoose.Schema.Types.ObjectId, refPath: "model_type" },
      model_type: {
        type: String,
        enum: ["Student", "Teacher"]
      },
      //   to: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
      message: String,
    },
  ],
});

const Group_chat_message_model = mongoose.model(
  "Group_chat_message",
  Group_chat_message
);

export default Group_chat_message_model;
