import { Router } from "express";
import { newuser,getUsers,deleteUser } from '../../controller/userController.js'; // Adjust the path as necessary
const router = Router();
import multer from "multer";
const upload = multer();

router.post('/newuser',upload.none(),newuser);
router.get('/getusers',getUsers);
router.delete('/deleteuser/:id',deleteUser);
export default router;