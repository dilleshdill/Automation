import express from "express"
import { adminLogin, registerAdmin } from "../controllers/adminRegisterController.js"
import { protect } from "../middleware/protect.js"
import { isAdmin } from "../middleware/isAdmin.js"

const adminRoute = express.Router()

// routes

adminRoute.post('/register',registerAdmin)
adminRoute.post('/login',protect,isAdmin,adminLogin)

export default adminRoute;