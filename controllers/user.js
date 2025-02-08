import { User } from "../models/user.js";
import { wrapAsync } from "../utils/wrapAsync.js";

const postUser = async (req, res) => {
  console.log("Received Data:", req.body); // Debugging log

  try {
    const { email, username, password, mobile_no ,alternate_no} = req.body;
    
    if (!email || !username || !password || !mobile_no||!alternate_no) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newUser = new User({ email, username, mobile_no ,alternate_no});
    await User.register(newUser, password); // passport-local-mongoose handles hashing
    res.json({ message: "User registered successfully" });
  } catch (error) {
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



export { postUser, logOut };