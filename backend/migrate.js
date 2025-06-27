import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { roles } from './constants/index.js';
import bcrypt from 'bcrypt';
import userSchema from './models/admin.js';

dotenv.config(); // Load MONGO_URI from .env

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  }
}

async function genAdmin(email, countryCode, number, password, name) {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await new userSchema({
      name,
      countryCode,
      password: passwordHash,
      role: roles.admin,
      phoneNumber: number,
      email,
      courtId: null,
      createdBy: null,
      updatedBy: null
    }).save();

    console.log(`✅ New Admin Created with id: ${user.id}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating admin:', err);
    process.exit(1);
  }
}

// Run
await connectDB();
await genAdmin('test@gmail.com', '+91', '9876543211', 'fasdfadsf', 'test');
