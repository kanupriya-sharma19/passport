import express from "express";
import passport from "passport";
import dotenv from "dotenv";
import session from "express-session";
import { sessionOptions } from "./utils/session.js";
import localStrategy from "passport-local";
import user  from "./routes/user.js";
import { User } from "./models/user.js";
import { connectToDB } from "./utils/connect.js";
import cors from "cors";

dotenv.config();
const app = express();
connectToDB();
const allowedOrigins = [
  "http://localhost:8081",           
  "http://192.168.0.104:8081"       
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));


const port =8080;
app.use(express.json());
app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session()); 
passport.use(new localStrategy({ usernameField: 'email' }, User.authenticate()));

passport.serializeUser((user, done) => {
  console.log("Serializing user:", user._id); // Debugging
  done(null, user._id); // Store only the user ID in session
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); // Use the ID stored in session to fetch user data
    if (!user) {
      return done(null, false); // If user not found, return false
    }
  
    done(null, user); // Pass the user object to req.user
  } catch (err) {
    done(err);
  }
});


app.use("/user", user);


app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to my API!" });
});



app.listen(8081, "0.0.0.0", () => {
  console.log("Server running on port 8081");
});
