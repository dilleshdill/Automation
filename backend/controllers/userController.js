import { UserRegister } from "../models/userRegister.js";

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