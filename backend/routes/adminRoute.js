import express from "express"
import { adminLogin, registerAdmin } from "../controllers/adminRegisterController.js"
import { protectAdmin } from "../middleware/protectAdmin.js"
import { isAdmin } from "../middleware/isAdmin.js"

const adminRoute = express.Router()

// routes

adminRoute.post('/register',registerAdmin)
adminRoute.post('/login',adminLogin)

export default adminRoute;