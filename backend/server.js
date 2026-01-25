import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import cookieParser from "cookie-parser";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";

import { connectDB } from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import adminRoute from "./routes/adminRoute.js";
import bidderRoute from "./routes/bidderRoute.js";
import playerRoute from "./routes/playersRoute.js";
import auctionRoute from "./routes/auctionRoute.js";
import userRoute from "./routes/userRoute.js";
import { registerAuctionSocketEvents } from "./socket/socketAuction.js";

dotenv.config();

const app = express();

/* -------------------- MIDDLEWARE -------------------- */

app.use(express.json());
app.use(cookieParser());

const origins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_DOMAIN, // MUST be full https://domain
].filter(Boolean);

app.use(
  cors({
    origin: origins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🔴 IMPORTANT: allow preflight requests
app.options(
  "*",
  cors({
    origin: origins,
    credentials: true,
  })
);

/* -------------------- SERVER & SOCKET -------------------- */

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: origins,
    credentials: true,
  },
});

app.set("io", io);

/* -------------------- SOCKET AUTH -------------------- */

io.use((socket, next) => {
  try {
    const cookiesHeader = socket.handshake.headers.cookie;

    if (!cookiesHeader) {
      socket.isAdmin = true;
      return next();
    }

    const parsedCookies = cookie.parse(cookiesHeader);
    const token = parsedCookies.bidder_token;

    if (!token) {
      socket.isAdmin = true;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_BIDDER_SECRET);

    socket.bidder = {
      bidderId: decoded.bidder_id,
      auctionId: decoded.auction_id,
    };

    next();
  } catch (err) {
    console.error("Socket auth failed:", err.message);
    socket.isAdmin = true;
    next();
  }
});

registerAuctionSocketEvents(io);

/* -------------------- ROUTES -------------------- */

app.use("/auth", authRoute);
app.use("/admin", adminRoute);
app.use("/bidder", bidderRoute);
app.use("/auction", auctionRoute);
app.use("/player", playerRoute);
app.use("/user", userRoute);

app.get("/api/check", (req, res) => {
  return res.status(200).json({ message: "Server is live 🚀" });
});

/* -------------------- START SERVER -------------------- */

const PORT = process.env.PORT || 5000;

await connectDB();

// server.listen(PORT, () => {
//   console.log(`✅ Server running on port ${PORT}`);
// });

export default server;
