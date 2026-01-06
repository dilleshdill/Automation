// models/playersModel.js
import mongoose from "mongoose";
import { statsSchema } from "./statsSchema.js";

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["Batsman", "Bowler", "All-Rounder", "Wicket-Keeper"],
      required: true,
    },

    country: {
      type: String,
      required: true,
    },

    basePrice: {
      type: Number,
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    /* ---- PLAYER STATS ---- */
    stats: statsSchema,

    /* ---- AUCTION STATUS ---- */
    status: {
      type: String,
      enum: ["pending", "sold", "unsold"],
      default: "pending",
    },

    soldTo: {
      type: mongoose.Schema.Types.ObjectId, // franchise _id
      default: null,
    },

    soldPrice: {
      type: Number,
      default: 0,
    },
  },
  { _id: true }
);


/* =========================
   SET SCHEMA
========================= */
const playersSchema = new mongoose.Schema(
  {
    setNo: {
      type: Number,
      required: true,
      unique: true,
    },

    setName: {
      type: String,
      required: true, // Batter, Bowler, All-rounder
    },

    playersList: [playerSchema],
  },
  { timestamps: true }
);

const Players =
  mongoose.models.Players ||
  mongoose.model("Players", playersSchema);

  export {Players , playerSchema};