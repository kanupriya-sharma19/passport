import express from "express";
import {
  postUser,
  sendSOSCall,
  logOut,
} from "../controllers/user.js";
import passport from "passport";


export const user = express.Router();
user.route("/signup").post(postUser);

user.route("/login").post((req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return res.status(500).json({ error: "Internal server error" });
    if (!user) {
      return res.status(401).json({ error: info?.message || "Invalid username or password" });
    }

    req.logIn(user, (err) => {
      if (err) return res.status(500).json({ error: "Login failed" });

      res.json({ message: "Login successful", user });
    });
  })(req, res, next);
});



user.get("/logout", logOut);

user.get("/me", (req, res) => {

  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

user.post("/sos", sendSOSCall);