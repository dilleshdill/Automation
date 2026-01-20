import express from "express"
import { adminLogin, getAdminProfile, registerAdmin } from "../controllers/adminRegisterController.js"

const adminRoute = express.Router()

adminRoute.post('/register',registerAdmin)
adminRoute.post('/login',adminLogin)
adminRoute.post("/get-admin",getAdminProfile)


export default adminRoute;