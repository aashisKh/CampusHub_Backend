import jwt from "jsonwebtoken";
import "dotenv/config";

const getToken = async (type, user) => {
  const token = jwt.sign(
  { identifier: user._id, userType: type },
  process.env.secretKey
);
return token;
};

export default getToken;
