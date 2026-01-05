import express from 'express';
import { registerUser } from '../controllers/authController.js';
import { protect } from '../middleware/protect.js';
import { isUser } from '../middleware/isUser.js';

const authRoute = express.Router();

// Routes
authRoute.post('/register',registerUser)
authRoute.post('/login',protect,isUser,registerUser)
export default authRoute;