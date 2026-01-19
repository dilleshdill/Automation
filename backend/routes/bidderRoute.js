import express from "express";
import { addFranchsis,franchiseLogin,getBidder } from "../controllers/bidderController.js";
import { bidderLogin, registerBidder } from "../controllers/bidderRegisterController.js";
import { protectBidder } from "../middleware/protectBidder.js";
// import { isBidder } from "../middleware/isBidder.js";

const bidderRoute = express.Router()

// routes

bidderRoute.post('/register',registerBidder)
bidderRoute.post('/login',bidderLogin)
bidderRoute.post("/add-franchsis",addFranchsis)
bidderRoute.post("/verify",franchiseLogin)
bidderRoute.post("/get-bidder",getBidder)

export default bidderRoute;