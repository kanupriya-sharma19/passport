import { User } from "../models/user.js";
import jwt from "jsonwebtoken";  
import bcrypt from "bcryptjs";  
import multer from "multer";
import { storage, cloudinary } from "../utils/cloudinary.js"; 
import dotenv from 'dotenv';
dotenv.config();

const upload = multer({ storage });

const validateUserInput = (email, password, confirmPassword) => {
  if (!email || !password || !confirmPassword) {
    return "All fields are required.";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }

  return null;
};

const generateToken = (user) => {
  return jwt.sign({ userId: user._id, email: user.email }, process.env.SECRETKEY, { expiresIn: '1h' });
};

const postUser = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

  
    const validationError = validateUserInput(email, password, confirmPassword);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }
       const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);  
    const newUser = new User({ email, username: email, password: hashedPassword });
    await newUser.save();  
    res.json({ message: "User registered successfully", userId: newUser._id.toString() });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,  
      userId: user._id.toString(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const logOut = (req, res) => {
  res.json({ message: "Logout successful" });
};

const updateUserProfile = [
  
  async (req, res) => {
    try {
      const userId = req.user.userId; 
      const { username, mobile_no, age, grade } = req.body;

      const updateData = { username, mobile_no, age, grade };

      if (req.file) {
        const cloudinaryResult = await cloudinary.uploader.upload(req.file.path);
        updateData.profile_image = cloudinaryResult.secure_url;
      }

      const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
      });

      res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
];

export { postUser, loginUser, logOut, updateUserProfile };
