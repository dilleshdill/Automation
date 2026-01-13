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
import cookie from "cookie";
import { Server } from "socket.io";
import http from "http";
import { Socket } from "dgram";
import jwt from 'jsonwebtoken'
import { registerAuctionSocketEvents } from "./socket/socketAuction.js";
import { runningAuctions } from "./socket/socketAuction.js";
import { Auction } from "./models/auctionModel.js";

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
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
  }
});

app.set("io", io); 

io.use((socket , next) =>{
  try {
    const cookies = socket.handshake.headers.cookie;

    // If no cookie → admin or public client
    if (!cookies) {
      socket.isAdmin = true;
      return next();
    }

    const parsed = cookie.parse(cookies);
    const token = parsed.bidder_token;

    // No bidder token → treat as admin
    if (!token) {
      socket.isAdmin = true;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_BIDDER_SECRET);

    socket.bidder = {
      bidderId: decoded.bidder_id,
      auctionId: decoded.auction_id
    };

    next();

  } catch(e) {
    console.log("Socket auth middleware failed", e);
    socket.isAdmin = true;
    next();
  }
});



io.on("connection", socket => {
  socket.on("join-auction", async (auctionId) => {
    socket.join(auctionId);
    console.log("ROOMS NOW:", io.sockets.adapter.rooms);
  });   
});

registerAuctionSocketEvents(io);

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
