import { GoogleGenerativeAI } from "@google/generative-ai";
// import "../config/env.js";
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) throw new Error("Missing GEMINI_API_KEY in environment");

const genAI = new GoogleGenerativeAI(API_KEY);
export default genAI;