import mongoose from "mongoose";

const TokenizeData = new mongoose.Schema({
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment" },

  // tokens: { type: [[String]] },
  // tokens: [[String]],
  tokens: { type: [[String]] },
});

const TokenizeData_Model = mongoose.model("TokenizeData", TokenizeData);

export default TokenizeData_Model;

// const TokenizeData = new mongoose.Schema({
//   assignment: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment" },

//   tokens: [ [String] ],
// });
