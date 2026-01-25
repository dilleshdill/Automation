import { Auction } from "../models/auctionModel.js";
import { BidderRegister } from "../models/bidderRegister.js";

export const addFranchsis = async (req, res) => {
  try {
    const { auctionId, franchises } = req.body;

    console.log(auctionId, franchises);

    const auction = await Auction.findById(auctionId);

    if (Array.isArray(franchises) && franchises.length > 0) {
      const filterFrachises = franchises.map((each) => ({
        teamName: each.teamName,
        email: each.email,
        password: each.password,
        purse: Number(each.purse) || 0,
        players: [],
      }));

      auction.franchises.push(...filterFrachises);
    }

    await auction.save();
    res.status(200).json("data successfully update into the database");
  } catch (error) {
    res.status(200).json("something went wrong", error);
  }
};

export const franchiseLogin = async (req, res) => {
  console.log("enter into the backend");
  try {
    const { auction_id, teamName, email, password } = req.body;

    const auction = await Auction.findById(auction_id);
    if (!auction) return res.status(404).json("Auction not found");

    const f = auction.franchises.find(
      (fr) => fr.email === email && fr.teamName === teamName,
    );
    if (!f) return res.status(404).json("Invalid email or Invalid TeamName");

    if (f.password !== password)
      return res.status(400).json("Invalid password");
    
      f.isEnter = true;
      await auction.save();
      return res.status(200).json({
        teamName: f.teamName,
        purse: f.purse,
        auction_id,
        teamId: f._id,
      });
    
  } catch (err) {
    console.log(err);
    res.status(500).json("Server error");
  }
};

export const getBidder = async (req, res) => {
  const { id} = req.body;
  
  const bidderData = await BidderRegister.findById(id).select("-password")
  console.log("bidder data",bidderData)

  if(!bidderData){
    return res.status(400).json("Bidder DoesNot Exist")
  }

  res.status(200).json({data:bidderData})

};

export const getUpcomingPlayers = async(req,res) => {
  
  const {auctionId} = req.query

  const auction = await Auction.findById(auctionId)

  if(!auction){
    return res.status(400).json("Auction Doesnot Exist")
  }

  const setNo = auction.currentSet
  const indexNo = auction.currentPlayerIndex

  const players =  auction.players.filter(each => each.setNo === setNo)
  
  if (!players){
    return res.status(400).json("Players Doesnot Exist")
  }

  const upcomingPlayers = players[0]?.playersList?.filter((each,index) => index > 0)

  res.status(200).json(upcomingPlayers)
}

// check auth
export const getBidderDetailes = async (req,res) =>{
  try{
    const bidderId = req.query.bidderId
    const bidder = await BidderRegister.findById(bidderId)
    if(!bidder){
      return res.status(400).json("Bidder Doesn't Exist")
    }
    return res.status(200).json({message:'success',data:bidder})
  }catch(error){
    return res.status(400).json({message:error})
  }
}

export const getPurse = async(req,res) => {
  try{
    const {email} = req.user
  
      const {auctionId} = req.query
      
      const auction = await Auction.findById(auctionId)
      
      const franchises = auction.franchises?.filter(eachItem => eachItem.email === email);
      
      
      if (!franchises) {
        return res.status(404).json({ error: "No franchise found for this email" });
      }

      
      return res.status(200).json({ data: franchises});

  }catch(err){
    res.status(400).json({err})
  }
}
