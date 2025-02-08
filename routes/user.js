import express from "express";
import {
  postUser,

  logOut,
} from "../controllers/user.js";
import passport from "passport";


export const user = express.Router();
user.route("/signup").post(postUser);
user.route("/login").post(
  passport.authenticate("local", {
    failureMessage: "Invalid credentials",
  }),
  (req, res) => {
    res.json({ message: "Login successful", user: req.user });
  }
);

user.get("/logout", logOut);

user.get("/me", (req, res) => {

  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});
