import { Router } from 'express';
import userApi  from './user.js';


let router = Router();

router.use('/user', userApi);



export default router;