// models/playersModel.js
import mongoose from "mongoose";
import { statsSchema } from "./statsSchema.js";

const playerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ["Batsman", "Bowler", "All-Rounder", "Wicket-Keeper"],
      required: true,
    },
    country: { type: String, required: true },
    basePrice: { type: Number, required: true },
    imageUrl: { type: String, required: true },

    stats: statsSchema,

    status: {
      type: String,
      enum: ["pending", "sold", "unsold"],
      default: "pending",
    },

    soldTo: { type: mongoose.Schema.Types.ObjectId, default: null },
    soldPrice: { type: Number, default: 0 },
  },
  { _id: true }
);


export { playerSchema }; 
