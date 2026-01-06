import bidderRegister from "../models/bidderRegister.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import generateUserToken from "../utils/generateUserToken.js";

dotenv.config();

//bidder Register

export const registerBidder = async (req, res) =>{
    try{
        const {email , password , bidderTeam} = req.body;

        if (!email || !password || ! bidderTeam){
            return res.status(400).json({message:"Please provide all required fields"});
        }

        const existingUser = await bidderRegister.findOne({email});
        if (existingUser){
            return res.status(400).json({message:"Bidder already exists"});
        }

        const hashedPassword = await bcrypt.hash(password , 10);

        const newBidder = new bidderRegister({
            bidderTeam,
            email,
            password:hashedPassword,
            bidderId: `BIDDER-${Date.now()}`
        })

        await newBidder.save();
        const token = generateUserToken(newBidder._id, newBidder.email, "Bidder");
        // const token = generateUserToken(newBidder._id)
        res.status(201).json({message:"Bidder registered successfully", token});
    } catch (error) {
        res.status(500).json({message:"Internal server error"});
    }
}

// bidder Login

export const bidderLogin = async (req , res) => {
    try{

        const {bidderId , password} = req.body

        if (! bidderId || ! password) {
            return res.status(400).json({message:"provide all the credentials"})
        }

        const existingUser = await bidderRegister.findOne({bidderId})

        if (!existingUser){
            return res.status(400).json({message:"Invalid credentials"});
        }

        const isPasswordCorrect = await bcrypt.compare(password , existingUser.password)

        if (!isPasswordCorrect){
            return res.status(400).json({message:"Invalid credentials"});
        }

        const token = generateUserToken(existingUser._id , existingUser.email , "Bidder")

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