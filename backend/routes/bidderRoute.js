import express from "express";
import { bidderLogin, registerBidder } from "../controllers/bidderRegisterController.js";
import { protectBidder } from "../middleware/protectBidder.js";
// import { isBidder } from "../middleware/isBidder.js";

const bidderRoute = express.Router()

// routes

bidderRoute.post('/register',registerBidder)
bidderRoute.post('/login',bidderLogin)

export default bidderRoute;