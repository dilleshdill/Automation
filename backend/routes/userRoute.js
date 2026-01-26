import express from 'express'
import { getUserProfile,getLogout,getAllAuction,getUserName } from '../controllers/userController.js'
import {protectUser} from '../middleware/protectUser.js'

const userRoute = express.Router()

userRoute.post("/get-user",protectUser,getUserProfile)
userRoute.get("/logout",protectUser,getLogout)
userRoute.get("/get-auction-list",protectUser,getAllAuction)
userRoute.get("/getName",protectUser,getUserName)

export default userRoute