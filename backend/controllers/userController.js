import { UserRegister } from "../models/userRegister.js";
import { Auction } from "../models/auctionModel.js";

export const getUserProfile = async(req,res) => {
    const {userId} = req.body
    console.log(userId)
    const data = await UserRegister.findById(userId)

    if(!data){
        return res.status(400).json(data)
    }
    res.status(200).json(data)
}

export const getLogout = async(req,res) => {
    res.clearCookie("userToken",{
        httpOnly:true,
        secure:true,
        sameSite:"none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    res.status(200).json("Logout Successfully")
}

export const getAllAuction = async(req,res) => {
    const auctions = await Auction.find()

    res.status(200).json(auctions)
}

    export const getUserName = async(req,res) => {
        try{
            const id = req.user.id
            const user = await UserRegister.findById(id)
            console.log(user)
            res.status(200).json(user)
        }catch(err){
            res.status(400).json("something went wrong")
        }
    }