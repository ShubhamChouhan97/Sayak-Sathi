import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const { MONGO_URI } = process.env;

mongoose.connect(MONGO_URI);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

export default db;