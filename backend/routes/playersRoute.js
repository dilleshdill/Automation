import express from "express"
import { addPlayer,getPlayer } from "../controllers/playerController.js"

const playerRoute = express.Router()

// Routes
playerRoute.post('/',addPlayer)
playerRoute.post("/get-player",getPlayer)


export default playerRoute;