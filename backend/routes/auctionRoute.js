import express from 'express';
import { protectAdmin } from '../middleware/protectAdmin.js';
import { addPlayersAndFranchises, createAuction,getAllAuctions, getAuctionDetails } from '../controllers/auctionController.js';
const auctionRoute = express.Router()

auctionRoute.post('/create-auction',protectAdmin,createAuction)
auctionRoute.post('/develop-auction',protectAdmin,addPlayersAndFranchises)
auctionRoute.get('/get-auction-list',protectAdmin,getAllAuctions)
auctionRoute.post('/get-auction',protectAdmin,getAuctionDetails)
export default auctionRoute;