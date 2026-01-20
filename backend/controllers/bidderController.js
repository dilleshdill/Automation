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


export const franchiseLogin = async (req, res) => {
    console.log("enter into the backend")
    try {
        const { auction_id, teamName,email, password } = req.body;

        const auction = await Auction.findById(auction_id);
        if (!auction) return res.status(404).json("Auction not found");
        
        const f = auction.franchises.find(fr => (fr.email === email && fr.teamName === teamName));
        if (!f) return res.status(404).json("Invalid email or Invalid TeamName");

        if (f.password !== password) return res.status(400).json("Invalid password");
        if (f.isEnter) {
            return res.status(400).json("Already Franchsis Enter In This Auction")
        }
        else {
            // f.isEnter = true
            // await auction.save()
            return res.status(200).json({
            teamName: f.teamName,
            purse: f.purse,
            auction_id ,
            teamId:f._id
            });
    }

    } catch (err) {
        console.log(err);
        res.status(500).json("Server error");
    }
};

export const getBidder = async(req,res) => {
    const {id,auctionId} = req.body
    const auction = await Auction.findById(auctionId)
    
    if(!auction){
        return res.status(400).json("Bidder Id Doesnot Exist")
    }
    const franchises = auction.franchises.filter(franchises => franchises._id.toString() === id)
    res.status(200).json(franchises[0])
}
