import mongoose from "mongoose";
import { playerSchema } from "./playersModel.js";

const franchisePlayerSchema = new mongoose.Schema(
  {
    playerId: mongoose.Schema.Types.ObjectId,
    name: String,
    soldPrice: Number,
    setNo: Number,
  },
  { _id: false }
);

const franchiseSchema = new mongoose.Schema(
  {
    teamName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }, 
    purse: { type: Number, required: true },
    isEnter:{type:Boolean,default:false},
    players: [franchisePlayerSchema],
  },
  { _id: true }
);

/* ---- MAIN AUCTION SCHEMA ---- */
const auctionSchema = new mongoose.Schema(
  {
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "AdminRegister", required: true },

    auction_name: { type: String, required: true },
    description: { type: String, default: "No Description" },
    short_name: { type: String, required: true },
    auction_img: { type: String, default: "#" },
    auction_date: { type: String, required: true },
    auction_time: { type: String, required: true },

    /* ---- PLAYERS GROUPED BY SET ---- */
    players: [
      {
        setNo: Number,
        setName: String,
        playersList: [playerSchema]
      }
    ],

    franchises: [franchiseSchema],

    /* Auction control */
    currentSet: { type: Number, default: 0 },
    currentPlayerIndex: { type: Number, default: 0 },

    currentPlayer: {
      playerId: mongoose.Schema.Types.ObjectId,
      name: String,
      basePrice: Number,
      setNo: Number,
    },

    currentBid: { type: Number, default: 0 },
    currentBidder: { type: mongoose.Schema.Types.ObjectId, default: null },

    status: {
      type: String,
      enum: ["upcoming", "live", "paused", "ended"],
      default: "upcoming",
    },
  },
  { timestamps: true }
);

export const Auction = mongoose.model("Auction", auctionSchema);
