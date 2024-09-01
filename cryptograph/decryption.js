import express from "express";
let router = express.Router();

const decrypt = (str, key) => {
  let decrypted = "";
  for (let i = 0; i < str.length; i++) {
    let ascii = str[i].charCodeAt();
    if (ascii >= 65 && ascii <= 90) {
      decrypted += String.fromCharCode(((ascii - key - 65 + 26) % 26) + 65);
    } else if (ascii >= 97 && ascii <= 122) {
      decrypted += String.fromCharCode(((ascii - key - 97 + 26) % 26) + 97);
    } else {
      decrypted += str[i];
    }
  }

  return decrypted;
};

export default decrypt;
