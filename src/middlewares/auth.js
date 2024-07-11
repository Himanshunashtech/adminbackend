import jwt from "jsonwebtoken";
import { Users } from "../models/usersModel.js";
import {asyncHandler} from "../utils/asyncHandler.js"; 
import dotenv from "dotenv"

dotenv.config({
  path: "./.env",
});
const key = process.env.KEY;

const auth = asyncHandler(async (req, res, next) => {
  try {
    let token = req.cookies.token || req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(400).json({ success: false, message: "Token not found" });
    }

    const decodedToken = jwt.verify(token, key);

    const user = await Users.findById(decodedToken._id);

    if (!user) {
      return res.status(400).json({ success: false, message: "User not authorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

export { auth };
