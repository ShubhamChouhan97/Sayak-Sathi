import { Router } from "express";
import { newuser } from '../../controller/userController.js'; // Adjust the path as necessary
const router = Router();

router.post('/newuser',newuser);

export default router;