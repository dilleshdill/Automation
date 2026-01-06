import express from 'express';
import { registerUser, userLogin } from '../controllers/authController.js';
import { protectUser } from '../middleware/protectUser.js';
// import { isUser } from '../middleware/isUser.js';

const authRoute = express.Router();

// Routes
authRoute.post('/register',registerUser)
authRoute.post('/login',userLogin)
export default authRoute;