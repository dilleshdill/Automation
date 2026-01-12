import express from "express";
import { addFranchsis } from "../controllers/bidderController.js";
import { bidderLogin, registerBidder } from "../controllers/bidderRegisterController.js";
import { protectBidder } from "../middleware/protectBidder.js";
// import { isBidder } from "../middleware/isBidder.js";

const bidderRoute = express.Router()

// routes

bidderRoute.post('/register',registerBidder)
bidderRoute.post('/login',bidderLogin)
bidderRoute.post("/add-franchsis",addFranchsis)

export default bidderRoute;