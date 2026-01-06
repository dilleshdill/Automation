import mongoose from "mongoose";

const soldPlayerSchema = new mongoose.Schema(
  {
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Players",
      required: true,
    },

    playerName: {
      type: String,
      required: true,
    },

    soldPrice: {
      type: Number,
      required: true,
    },

    winnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BidderRegister",
      required: true,
    },
  },
  { timestamps: true }
);
