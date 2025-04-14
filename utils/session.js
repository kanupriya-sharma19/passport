import dotenv from "dotenv";
dotenv.config();
import MongoStore from "connect-mongo";

const store = MongoStore.create({
  mongoUrl: process.env.MONGODB_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

export const sessionOptions = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, 
    httpOnly: true,
    sameSite: "lax",
  },
};
