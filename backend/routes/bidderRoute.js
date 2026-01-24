import express from "express";
import { addFranchsis,franchiseLogin,getBidder,getUpcomingPlayers,getBidderDetailes } from "../controllers/bidderController.js";
import { bidderLogin, registerBidder, bidderSignUp,getLogout, bidderSignIn } from "../controllers/bidderRegisterController.js";
import { protectBidder } from "../middleware/protectBidder.js";
import {protectRegisterBidder} from '../middleware/protectRegisterBidder.js'
// import { isBidder } from "../middleware/isBidder.js";

const bidderRoute = express.Router()

// routes

bidderRoute.post('/register',registerBidder)
bidderRoute.post('/login',bidderLogin)
bidderRoute.post("/add-franchsis",addFranchsis)
bidderRoute.post("/verify",franchiseLogin)
bidderRoute.post("/get-bidder",getBidder)
bidderRoute.get("/upcoming-players",getUpcomingPlayers)
bidderRoute.post("/bidderSignup",bidderSignUp)
bidderRoute.post("/bidderSignin",bidderSignIn)
bidderRoute.get("/checkAuth",getBidderDetailes)
bidderRoute.get("/logout",protectRegisterBidder,getLogout)

export default bidderRoute; 