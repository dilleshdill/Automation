import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { Auction } from "../models/auctionModel.js";
import {BidderRegister} from '../models/bidderRegister.js'
import generateBidderToken from "../utils/generateBidderToken.js";
import generateBidderRegisterToken from "../utils/generateBidderRegisterToken.js";

dotenv.config();

export const registerBidder = async (req, res) => {
  try {
    const { email, auctionId, password, bidderTeam } = req.body;

    if (!email || !auctionId || !password || !bidderTeam) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }
    const auction = await Auction.findById(auctionId);

    if (!auction) {
      return res.status(400).json({ message: "no auctionId found" });
    }

    const existingFranchise = auction.franchises.find((e) => e.email === email);
    if (existingFranchise) {
      return res.status(400).json({ message: "Bidder already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newBidder = {
      _id: new mongoose.Types.ObjectId(),
      bidderTeam,
      email,
      password: hashedPassword,
      bidderId: `BIDDER-${Date.now()}`,
      players: [],
    };
    auction.franchises.push(newBidder);
    await auction.save();
    const token = generateBidderToken(
      newBidder._id,
      auction._id,
      newBidder.email,
    );
    // const token = generateUserToken(newBidder._id)
    res.status(201).json({ message: "Bidder registered successfully", token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// bidder Login
export const bidderLogin = async (req, res) => {
  try {
    const { bidderId, auctionId, password } = req.body;

    if (!bidderId || !auctionId || !password) {
      return res.status(400).json({ message: "provide all the credentials" });
    }

    const existingAuction = await Auction.findById(auctionId);

    if (!existingAuction) {
      return res.status(400).json({ message: "no auction found" });
    }

    const franchise = existingAuction.franchises.find(
      (f) => f._id.toString() === bidderId,
    );

    if (!franchise)
      return res.status(400).json({ message: "franchise not found" });

    const isPasswordCorrect = await bcrypt.compare(
      franchise.password,
      existingUser.password,
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateBidderToken(
      existingUser._id,
      auctionId,
      existingUser.email,
    );

    res.cookie("bidder_token", token, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: "login successfully", token });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// bidder SignUp
export const bidderSignUp = async (req, res) => {
  try {
    const { bidderName, email, password } = req.body;

    if (!bidderName || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Check existing user correctly
    const existingUser = await BidderRegister.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new BidderRegister({
      bidderName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = generateBidderRegisterToken(newUser._id, newUser.email);

    res.cookie("bidder_register_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ data: newUser._id });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const bidderSignIn = async(req,res) => {
  // console.log(req.body);
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const existingUser = await BidderRegister.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = generateBidderRegisterToken(existingUser._id, existingUser.email);

    res.cookie("bidder_register_token", token, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    // console.log("token",token)
    res
      .status(200)
      .json({ message: "User logged in successfully", data: existingUser._id });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}


export const getLogout = async(req,res) => {
  console.log(req.user)

  res.clearCookie("bidder_register_token",{
    httpOnly:true,
    secure:false,
    sameSite:"lax"
  })
  
  res.status(200).json("Logout Successfully")
}
