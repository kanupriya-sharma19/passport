import express from "express";
import multer from "multer";
import { storage } from "../utils/cloudinary.js";
import {
  postUser,
  loginUser,
  logOut,
  updateUserProfile,
} from "../controllers/user.js";
import { verifyToken } from "../middlewares/auth.js"; 
const user = express.Router();
const upload = multer({ storage });


user.post("/signup", postUser);
user.post("/login", loginUser);
user.post("/logout", logOut);
user.put("/profile",verifyToken, upload.single("profile_image"), updateUserProfile);

export default user;
