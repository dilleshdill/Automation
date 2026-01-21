import express from 'express'
import { getUserProfile } from '../controllers/userController.js'

const userRoute = express.Router()

userRoute.post("/get-user",getUserProfile)

export default userRoute