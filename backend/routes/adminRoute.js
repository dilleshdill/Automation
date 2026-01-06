import express from "express"
import { adminLogin, registerAdmin,getAuctions } from "../controllers/adminRegisterController.js"
import { protectAdmin } from "../middleware/protectAdmin.js"

const adminRoute = express.Router()

adminRoute.post('/register',registerAdmin)
adminRoute.post('/login',adminLogin)


export default adminRoute;