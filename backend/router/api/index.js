import { Router } from 'express';
import userApi  from './user.js';
import requestApi from './request.js'; // Assuming you have a request.js file for handling requests

let router = Router();

router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

router.use('/user', userApi);
router.use('/request',requestApi)



export default router;