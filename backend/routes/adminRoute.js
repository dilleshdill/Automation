import express from "express"
import { adminLogin, registerAdmin } from "../controllers/adminRegisterController.js"

const adminRoute = express.Router()

adminRoute.post('/register',registerAdmin)
adminRoute.post('/login',adminLogin)


export default adminRoute;