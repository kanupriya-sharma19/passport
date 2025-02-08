import { User } from "../models/user.js";
import { wrapAsync } from "../utils/wrapAsync.js";
import twilio from "twilio";

const postUser = async (req, res) => {
  console.log("Received Data:", req.body); // Debugging log

  try {
    const { email, username, password, mobile_no, alternate_no } = req.body;
    
    if (!email || !username || !password || !mobile_no || !alternate_no) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newUser = new User({ email, username, mobile_no, alternate_no });
    const registeredUser = await User.register(newUser, password); // passport-local-mongoose

    console.log("Registered User:", registeredUser); // Debug log

    res.json({
      message: "User registered successfully",
      userId: registeredUser._id,  // ✅ Send userId
    });
  } catch (error) {
    console.error("Signup Error:", error); // Log error for debugging
    res.status(400).json({ error: error.message });
  }
};




const logOut = wrapAsync(async (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) return next(err);

      res.clearCookie("connect.sid"); 
      res.status(200).json({ message: "Logout successful" });
    });
  });
});


const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const sendSOSCall = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Fetch user from DB
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.alternate_no) {
      return res.status(404).json({ error: "Alternate number not found" });
    }

    console.log("Initiating SOS call to:", user.alternate_no);

    // Initiate SOS call
    const call = await client.calls.create({
      url: "http://demo.twilio.com/docs/voice.xml",
      to: user.alternate_no,
      from: process.env.TWILIO_PHONE_NUMBER,
    });

    console.log("SOS Call Successful. Call SID:", call.sid);
    res.json({ message: "SOS Call initiated", callSid: call.sid });

  } catch (error) {
    console.error("Twilio Error:", error); // Print full error
    res.status(500).json({ error: error.message || "Failed to make the call" });
  }
};


export { postUser, logOut,sendSOSCall };