import mongoose from "mongoose";
import { playerSchema } from "./playersModel.js";


/* =========================
   FRANCHISE PLAYER SCHEMA
========================= */

const franchisePlayerSchema = new mongoose.Schema(
  {
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    name: String,
    soldPrice: Number,
    setNo: Number,
  },
  { _id: false }
);

/* =========================
   FRANCHISE SCHEMA (INSIDE AUCTION)
========================= */
const franchiseSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true, // 🔐 hash this before saving
    },

    purse: {
      type: Number,
      required: true,
    },

    players: [franchisePlayerSchema],
  },
  { _id: true }
);

/* =========================
   AUCTION SCHEMA
========================= */
const auctionSchema = new mongoose.Schema(
  {
    /* ---- ADMIN ---- */
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminRegister",
      required: true,
    },

    /* ---- BASIC INFO ---- */
    auction_name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "No Description",
    },

    short_name: {
      type: String,
      required: true,
    },

    auction_img: {
      type: String,
      default: "#",
    },

    auction_date: {
      type: String,
      required: true,
    },

    auction_time: {
      type: String,
      required: true,
    },

    /* ---- AUCTION PLAYERS ---- */
    players: [playerSchema],

    /* ---- FRANCHISES ---- */
    franchises: [franchiseSchema],

    /* ---- LIVE CONTROL ---- */
    currentPlayerIndex: {
      type: Number,
      default: 0,
    },

    currentPlayer: {
      playerId: mongoose.Schema.Types.ObjectId,
      name: String,
      basePrice: Number,
      setNo: Number,
    },

    /* ---- BIDDING ---- */
    currentBid: {
      type: Number,
      default: 0,
    },

    currentBidder: {
      type: mongoose.Schema.Types.ObjectId, // franchise _id
      default: null,
    },

    currentSet: {
      type: Number,
      default: -1,
    },

    /* ---- STATUS ---- */
    status: {
      type: String,
      enum: ["upcoming", "live", "paused", "ended"],
      default: "upcoming",
    },
  },
  { timestamps: true }
);

export const Auction =
  mongoose.models.Auction ||
  mongoose.model("Auction", auctionSchema);
