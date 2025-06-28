import { Router } from "express";
import { newuser,getUsers,deleteUser } from '../../controller/userController.js'; // Adjust the path as necessary
const router = Router();

router.post('/newuser',newuser);
router.get('/getusers',getUsers);
router.delete('/deleteuser/:id',deleteUser);
export default router;