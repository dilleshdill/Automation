import express from 'express'
import { getUserProfile,getLogout } from '../controllers/userController.js'
import {protectUser} from '../middleware/protectUser.js'

const userRoute = express.Router()

userRoute.post("/get-user",protectUser,getUserProfile)
userRoute.get("/logout",protectUser,getLogout)

export default userRoute