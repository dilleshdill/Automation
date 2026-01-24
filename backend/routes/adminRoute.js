import express from "express"
import { adminLogin, getAdminProfile, registerAdmin,getLogout } from "../controllers/adminController.js"
import { protectAdmin } from '../middleware/protectAdmin.js'

const adminRoute = express.Router()

adminRoute.post('/register',registerAdmin)
adminRoute.post('/login',adminLogin)
adminRoute.post("/get-admin",getAdminProfile)
adminRoute.get("/logout",protectAdmin,getLogout)

export default adminRoute;