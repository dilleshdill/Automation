import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import adminRoute from "./routes/adminRoute.js";
import bidderRoute from "./routes/bidderRoute.js";
import playerRoute from "./routes/playersRoute.js";
import auctionRoute from "./routes/auctionRoute.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from "http";
import { Socket } from "dgram";
import jwt from 'jsonwebtoken'

dotenv.config();

const app = express();
app.use(cookieParser());

// Middleware
app.use(express.json());

const origins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_DOMAIN,
].filter(Boolean);

app.use(cors({
  origin: origins, // frontend URL
  credentials: true
}));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.set("io", io); // Make io accessible in routes/controllers


io.use((socket , next) =>{
  try{
    const cookies = socket.handshake.headers.cookie;
    if (! cookies){
      return next(new Error("no cookies"))
    }
    const parsedCookie = cookie.parse(cookies)
    const token = parsedCookie.bidder_token

    if (! token){
      return next(new Error("no bidder token is found"))
    }

    const decoded = jwt.verify(token , process.env.JWT_BIDDER_SECRET);

    socket.bidder = {
      bidderId:decoded.bidder_id,
      auctionId : decoded.auction_id
    }

    next()
  }catch(e){
    return resizeBy.status(500).json({message:"authentication failed"})
  }
})

io.on('connection',socket => {
  console.log("franchise connected" , socket.bidder.bidderId)

  socket.join(socket.bidder.auctionId)

  socket.on('disconnect', () => {
    console.log("Franchise disconnected:", socket.bidder.bidderId);
  }) 
})
//Routes

app.use('/auth',authRoute)
app.use('/admin',adminRoute)
app.use('/bidder',bidderRoute)
app.use('/add-player',playerRoute)
app.use('/auction',auctionRoute)

// ✅ CONNECT DB FIRST
const PORT = process.env.PORT || 5000;
await connectDB();

// ✅ START SERVER (NO `server` VARIABLE NEEDED)
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
