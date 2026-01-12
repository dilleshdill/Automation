import { Auction } from "../models/auctionModel.js";

export const addFranchsis = async(req,res) => {
    try{
    const {auctionId,franchises} = req.body

    console.log(auctionId,franchises)

    const auction = await Auction.findById(auctionId)
    
        if (Array.isArray(franchises) && franchises.length > 0 ){
            const filterFrachises = franchises.map(each => ({
                teamName : each.teamName,
                email : each.email,
                password:each.password,
                purse:Number(each.purse) || 0 ,
                players:[]
            }))

            auction.franchises.push(...filterFrachises)
        }

        await auction.save()
        res.status(200).json("data successfully update into the database")
    }catch(error){
        res.status(200).json("something went wrong",error)
    }
}