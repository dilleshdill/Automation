import mongoose from "mongoose";

const bidderRegisterSchema = new mongoose.Schema({
  bidderName: {
    type: String,
    required: true,
  },
  bidderTeam: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  bidderId: {
    type: String,
    required: true,
    unique: true,
  }
});

export default mongoose.model("BidderRegister", bidderRegisterSchema);