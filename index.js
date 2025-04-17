import express from "express";
import dotenv from "dotenv";
import user  from "./routes/user.js";
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


app.use("/user", user);


app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to my API!" });
});



app.listen(8080, "0.0.0.0", () => {
  console.log("Server running on port 8080");
});
