// models/statsSchema.js
import mongoose from "mongoose";

export const statsSchema = new mongoose.Schema(
  {
    matches: {
      type: Number,
      required: true,
      default: 0,
    },

    innings: {
      type: Number,
      required: true,
      default: 0,
    },

    runs: {
      type: Number,
      required: true,
      default: 0,
    },

    highestScore: {
      type: Number,
      required: true,
      default: 0,
    },

    average: {
      type: Number,
      required: true,
      default: 0,
    },

    strikeRate: {
      type: Number,
      required: true,
      default: 0,
    },

    fifties: {
      type: Number,
      required: true,
      default: 0,
    },

    hundreds: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { _id: false }
);
