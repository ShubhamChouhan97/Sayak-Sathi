// session.js
import session from "express-session";
import MongoStore from "connect-mongo";

const sessionMiddleware = session({
  name: "sid",
  secret: process.env.SESSION_SECRET || "supersecret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI || "mongodb://localhost:27017/sayaksathi", // Default to local MongoDB if not set
    collectionName: "sessions",
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true,
    sameSite: "lax",
    secure: false, // Set to true in production with HTTPS
  },
});

export default sessionMiddleware;
