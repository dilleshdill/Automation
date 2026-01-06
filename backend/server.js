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

app.use('/auth',authRoute)
app.use('/admin',adminRoute)
app.use('/bidder',bidderRoute)
app.use('/add-player',playerRoute)
app.use('/auction',auctionRoute)

// ✅ CONNECT DB FIRST
const PORT = process.env.PORT || 5000;
await connectDB();

// ✅ START SERVER (NO `server` VARIABLE NEEDED)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
