import express from 'express';
import { Router } from "express";
import { loginUser } from '../controller/userController.js';
const router = Router();

router.post('/login', loginUser);


export default router;