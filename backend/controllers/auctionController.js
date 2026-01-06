import { Auction } from "../models/auctionModel.js";

export const createAuction = async (req, res) => {
    // console.log("Create Auction Request Body:", req.body);
    // console.log("Authenticated Admin ID:", req.user.id );
  try {
    const {
      auction_name,
      description,
      short_name,
      auction_date,
      auction_time,
      auction_img,
    } = req.body;

    if (
      !auction_name ||
      !description ||
      !short_name ||
      !auction_date ||
      !auction_time ||
      !auction_img
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🔥 adminId comes from middleware (JWT cookie)
    const adminId = req.user.id;

    const newAuction = new Auction({
      adminId,              // ✅ ADD THIS
      auction_name,
      description,
      short_name,
      auction_date,
      auction_time,
      auction_img,
    });

    await newAuction.save();

    res.status(201).json({
      message: "Auction created successfully",
      newAuction,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// add playerse and franchise to auction

export const addPlayersAndFranchises = async (req, res) => {
    console.log(req.body)
  try {
    const {auction_id : auction_id, auction_name : auctionName , auction_date:auctionTime ,auction_description : auctionDescription,
            short_name : auctionShortName , auction_time : auctionPalyerTime , franchises :franchise , players : players } = req.body
    const auctions = await Auction.findOne({auction_id});

    if (!auction_id){
        return res.status(400).json({message:"auction not found"})
    }
    
  }catch(error){
    return res.status(500).json({message:"server Error"})
  }
}
