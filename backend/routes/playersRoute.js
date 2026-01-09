import express from "express"
import { addPlayer } from "../controllers/playerController.js"

const playerRoute = express.Router()

// Routes
playerRoute.post('/',addPlayer)


export default playerRoute;