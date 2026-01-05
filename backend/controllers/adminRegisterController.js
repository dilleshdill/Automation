import adminRegister from "../models/adminRegister.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import generateUserToken from "../utils/generateUserToken.js";


// admin Register

export const  registerAdmin = async (req , res) => {
    try{
        
        const {adminName , email , password } = req.body
        // console.log(req.body);
        if (! adminName || !email || !password){
            return res.status(400).json({message:"Please provide all required fields"})
        }

        const existingUser = await adminRegister.findOne({email})

        if (existingUser){
            return res.status(400).json({message:"Bidder already exists"});
        }
        
        const hashedPassword = await bcrypt.hash(password , 10)
        const newAdmin = new adminRegister({
            adminName,
            email,
            password:hashedPassword,
            adminKey:`ADMIN-${Date.now()}`
        })
        
        await newAdmin.save()
        const token = generateUserToken(newAdmin._id , newAdmin.email , "Admin")
        return res.status(201).json({message:"Bidder registered successfully", token})
    }
    catch(error){
        res.status(500).json({message:"Internal server error"});
    }
}

// admin login

export const adminLogin = async (req,res) => {
    try{

        const {adminKey , password} = req.body

        if (!adminKey || ! password){
            return res.status(400).json({message:"provide all required details"})
        }

        const existingUser = await adminRegister.findOne({email})

        if (!existingUser){
            return res.status(400).json({message:"invalid credentials"})
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)

        if (!isPasswordCorrect){
            return res.status(400).json({message:"invalid credentials"})
        }

        const token = generateUserToken(existingUser._id , existingUser.email , "Admin")

        res.cookie("admin-token", token, {
        httpOnly: true,
        secure: false, // true in production (HTTPS)
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({message:"admin login successfully" , token})
    }catch(error){
        res.status(500).json({message:"Internal server error"});
    }
}