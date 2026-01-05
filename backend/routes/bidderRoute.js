import express from "express";
import { bidderLogin, registerBidder } from "../controllers/bidderRegisterController.js";
import { protect } from "../middleware/protect.js";
import { isBidder } from "../middleware/isBidder.js";

const bidderRoute = express.Router()

// routes

bidderRoute.post('/register',registerBidder)
bidderRoute.post('/login',protect,isBidder,bidderLogin)

export default bidderRoute;