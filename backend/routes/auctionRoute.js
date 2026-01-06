import express from 'express';
import { protectAdmin } from '../middleware/protectAdmin.js';
import { addPlayersAndFranchises, createAuction } from '../controllers/auctionController.js';
const auctionRoute = express.Router()

// routes

auctionRoute.post('/create-auction',protectAdmin,createAuction)
auctionRoute.post('/develop-auction',protectAdmin,addPlayersAndFranchises)

export default auctionRoute;