import { Router } from "express";
import { loginUser } from '../controller/userController.js';
const router = Router();

import { checkLoginStatus } from "../middleware/checkAuth.js";

import api from "./api/index.js";

router.use('/api',checkLoginStatus, api);
router.post('/login', loginUser);

router.get('/session', checkLoginStatus, async (req, res, next) => {
    try {
        console.log('console at router session');
        const sessionObj = {
            email: req.session.email,
            role: req.session.role,
            name: req.session.name,
            userId: req.session.userId,
            phoneNumber: req.session.phoneNumber,
        }
    //    console.log(sessionObj);
        return res.json(sessionObj);
    } catch (error) {
        next(error);
    }
});


export default router;