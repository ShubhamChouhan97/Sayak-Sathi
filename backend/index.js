// // index.js

// import express from 'express';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import session from 'express-session';
// import MongoStore from 'connect-mongo';
// import helmet from 'helmet';
// import morgan from 'morgan';

// dotenv.config();

// import { createSocketServer } from './config/socket.js'; // your file

// const app = express();


// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(helmet()); // Security headers
// app.use(cors({
//   origin: 'http://localhost:3000', // frontend origin
//   credentials: true
// }));
// app.use(express.json()); // Parse JSON request bodies
// app.use(cookieParser());
// app.use(morgan('dev'));

// // Session setup
// app.use(session({
//   name: 'sid',
//   secret: process.env.SESSION_SECRET || 'supersecret',
//   resave: false,
//   saveUninitialized: false,
//   store: MongoStore.create({
//     mongoUrl: process.env.MONGO_URI,
//     collectionName: 'sessions',
//   }),
//   cookie: {
//     maxAge: 1000 * 60 * 60 * 24, // 1 day
//     httpOnly: true,
//     sameSite: 'lax',
//     secure: false, // set to true if using HTTPS
//   }
// }));

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI)
// .then(() => {
//   console.log('✅ Connected to MongoDB');
// })
// .catch(err => {
//   console.error('❌ MongoDB connection error:', err);
// });


// app.get('/', (req, res) => {
//     res.send('Welcome to the SayakSathi Backend API');
// });

// // Routes
// import Routes from './router/index.js';


// app.use('/', Routes);

// app.listen(PORT, () => {
//     console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

// index.js

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import helmet from 'helmet';
import morgan from 'morgan';
import http from 'http'; // ✅ Needed for Socket.IO server
import sessionMiddleware from './config/session.js'; // ✅ Your session setup

import { createSocketServer } from './config/socket.js'; // ✅ Your Socket.IO setup

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
// ✅ Create HTTP server
const server = http.createServer(app);
app.use(sessionMiddleware);
// ✅ Attach Socket.IO to HTTP server
createSocketServer(server, sessionMiddleware); 
// socketSetup(server, sessionMiddleware);

// Middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:2001', // ✅ Frontend origin
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// // Session setup
// app.use(session({
//   name: 'sid',
//   secret: process.env.SESSION_SECRET || 'supersecret',
//   resave: false,
//   saveUninitialized: false,
//   store: MongoStore.create({
//     mongoUrl: process.env.MONGO_URI,
//     collectionName: 'sessions',
//   }),
//   cookie: {
//     maxAge: 1000 * 60 * 60 * 24, // 1 day
//     httpOnly: true,
//     sameSite: 'lax',
//     secure: false, // true if using HTTPS
//   }
// }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('✅ Connected to MongoDB');
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// Routes
import Routes from './router/index.js';
app.use('/', Routes);

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the SayakSathi Backend API');
});

// ✅ Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
