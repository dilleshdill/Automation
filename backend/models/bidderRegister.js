import mongoose from "mongoose";

const bidderRegisterSchema = new mongoose.Schema(
  {
    bidderName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
  },{ timestamps: true });

export const BidderRegister =  mongoose.model("BidderRegister", bidderRegisterSchema);