import mongoose from "mongoose";

const Otp = new mongoose.Schema({
  value: { type: String, require: true },
  sent: { type: Number, require: true },
  senderName: { type: String, require: true },
});

const Otp_Model = mongoose.model("Otp", Otp);
export default Otp_Model;
