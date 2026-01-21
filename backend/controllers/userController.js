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