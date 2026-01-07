import bidderRegister from "../models/bidderRegister.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import generateUserToken from "../utils/generateUserToken.js";
import { Auction } from "../models/auctionModel.js";
dotenv.config();

//bidder Register

export const registerBidder = async (req, res) =>{
    try{
        const {email, auctionId , password , bidderTeam} = req.body;

        if (!email || !auctionId || !password || ! bidderTeam){
            return res.status(400).json({message:"Please provide all required fields"});
        }
        const auction = await Auction.findById(auctionId)

        if(!auction){
            return res.status(400).json({message:"no auctionId found"})
        }

        const existingFranchise = auction.franchises.find(
            (e) => e.email === email
        )
        if (existingFranchise){
            return res.status(400).json({message:"Bidder already exists"});
        }

        const hashedPassword = await bcrypt.hash(password , 10);

        const newBidder = {
            _id: new mongoose.Types.ObjectId(),
            bidderTeam,
            email,
            password: hashedPassword,
            bidderId: `BIDDER-${Date.now()}`,
            players: [],
        };
        auction.franchises.push(newBidder)
        await auction.save();
        const token = generateUserToken(newBidder._id, auction._id, newBidder.email);
        // const token = generateUserToken(newBidder._id)
        res.status(201).json({message:"Bidder registered successfully", token});
    } catch (error) {
        res.status(500).json({message:"Internal server error"});
    }
}

// bidder Login

export const bidderLogin = async (req , res) => {
    try{

        const {bidderId , auctionId , password} = req.body

        if (! bidderId || !auctionId || ! password) {
            return res.status(400).json({message:"provide all the credentials"})
        }

        const existingAuction = await Auction.findById(auctionId)

        if (!existingAuction){
            return res.status(400).json({message:"no auction found"});
        }

        const franchise = existingAuction.franchises.find(
            (f) => f._id.toString() === bidderId
        );

        if (!franchise)
            return res.status(400).json({message:"franchise not found"})


        const isPasswordCorrect = await bcrypt.compare(franchise.password , existingUser.password)

        if (!isPasswordCorrect){
            return res.status(400).json({message:"Invalid credentials"});
        }

        const token = generateUserToken(existingUser._id, auctionId , existingUser.email )

        res.cookie("bidder_token", token, {
        httpOnly: true,
        secure: false, // true in production (HTTPS)
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({message:"login successfully" , token})
    }catch(error){
        res.status(500).json({message:"Server Error", error:error.message});
    }
}