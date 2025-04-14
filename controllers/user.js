import { User } from "../models/user.js";
import passport from "passport";  
// import twilio from "twilio";

import multer from "multer";
import { storage, cloudinary } from "../utils/cloudinary.js"; // assuming your config file is here
const upload = multer({ storage });

 const postUser = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match." });
    }

    const newUser = new User({ email, username: email }); 
    await User.register(newUser, password);

    const registeredUser = await User.findOne({ email });
    res.json({
      message: "User registered successfully",
      userId: registeredUser._id.toString(),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



 const loginUser = (req, res, next) => {
  // Use passport's authenticate method to handle login
  passport.authenticate("local", async (err, user, info) => {
    if (err) {
      
      return next(err);
    }
  
    if (!user) {
     
      return res.status(400).json({ error: "Invalid credentials" });
    }
  
    req.login(user, (err) => {
      if (err) {
       
        return next(err);
      }
   
      return res.json({ message: "Login successful", userId: user._id.toString() });
    });
  })(req, res, next);
  
};



const logOut = async (req, res, next) => {
  try {
    req.logout((err) => {
      if (err) return next(err);

      req.session.destroy((err) => {
        if (err) return next(err);

        res.clearCookie("connect.sid");
        res.status(200).json({ message: "Logout successful" });
      });
    });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ error: "Logout failed." });
  }
};

const updateUserProfile = [
  // file field name
  async (req, res) => {
    try {
      const userId = req.user._id;
      const {
        username,
        mobile_no,

        age,
        grade
      } = req.body;

      const updateData = {
        username,
        mobile_no,
        
        age,
        grade
      };
    
      
      if (req.file) {
        updateData.profile_image = req.file.path;
      }

      const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
      });

      res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
];


// const client = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );


// const sendSOSCall = async (req, res) => {
//   try {
//     console.log("Request Body:", req.body);  // Log the request body to debug

//     const { userId, from } = req.body; 

//     if (!userId || !from) {
//       return res.status(400).json({ error: "User ID and 'from' number are required" });
//     }

//     // Fetch user from DB
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     if (!user.alternate_no) {
//       return res.status(404).json({ error: "Alternate number not found" });
//     }

//     console.log("Initiating SOS call to:", user.alternate_no);

//     // Assuming you are using Twilio to make the call
//     const call = await client.calls.create({
//       url: "http://demo.twilio.com/docs/voice.xml", // Replace with your Twilio endpoint
//       to: "+919004712669",
//       from: process.env.TWILIO_PHONE_NUMBER,  
//     });

//     console.log("SOS Call Successful. Call SID:", call.sid);
//     res.json({ message: "SOS Call initiated", callSid: call.sid });

//   } catch (error) {
//     console.error("Twilio Error:", error); // Print full error
//     res.status(500).json({ error: error.message || "Failed to make the call" });
//   }
// };

export { postUser, logOut,updateUserProfile ,loginUser};