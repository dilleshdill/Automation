import express from "express";
import { addFranchsis,franchiseLogin,getBidder,getUpcomingPlayers,getBidderDetailes,getPurse,getAllAuction,getBidderName } from "../controllers/bidderController.js";
import { bidderLogin, registerBidder, bidderSignUp,getLogout, bidderSignIn } from "../controllers/bidderRegisterController.js";
import { protectBidder } from "../middleware/protectBidder.js";
import {protectRegisterBidder} from '../middleware/protectRegisterBidder.js'
// import { isBidder } from "../middleware/isBidder.js";

const bidderRoute = express.Router()

// routes

bidderRoute.post('/register',registerBidder)
bidderRoute.post('/login',bidderLogin)
bidderRoute.post("/bidderSignup",bidderSignUp)
bidderRoute.post("/bidderSignin",bidderSignIn)

bidderRoute.post("/add-franchsis",protectRegisterBidder,addFranchsis)
bidderRoute.post("/verify",protectRegisterBidder,franchiseLogin)
bidderRoute.get("/get-bidder",protectRegisterBidder,getBidder)
bidderRoute.get("/upcoming-players",protectRegisterBidder,getUpcomingPlayers)

bidderRoute.get("/checkAuth",protectRegisterBidder,getBidderDetailes)
bidderRoute.get("/logout",protectRegisterBidder,getLogout)
bidderRoute.get("/getPurse",protectRegisterBidder,getPurse)
bidderRoute.get("/get-auction-list",protectRegisterBidder,getAllAuction)
bidderRoute.get("/getName",protectRegisterBidder,getBidderName)

export default bidderRoute; 