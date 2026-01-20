import { Auction } from "../models/auctionModel.js";
import { startTimer } from "../socket/socketAuction.js";


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
  try {
    const { auctionId, franchises, players } = req.body;

    if (!auctionId) return res.status(400).json({ message: "Auction ID required" });

    const auction = await Auction.findById(auctionId);
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    /* ---- Add Franchises ---- */
    if (Array.isArray(franchises) && franchises.length > 0) {
      const formatted = franchises.map(f => ({
        teamName: f.teamName,
        email: f.email,
        password: f.password,
        purse: Number(f.purse),
        players: [],
      }));

      auction.franchises.push(...formatted);
    }

    /* ---- Group Players by setNo ---- */
    if (Array.isArray(players) && players.length > 0) {
      const grouped = {};

      players.forEach(p => {
        const setNo = Number(p.setNo || 0);
        const setName = p.setName || "Default";

        if (!grouped[setNo]) {
          grouped[setNo] = {
            setNo,
            setName,
            playersList: [],
          };
        }

        grouped[setNo].playersList.push({
          name: p.name,
          role: p.battingStyle,
          country: p.country,
          imageUrl: p.imageUrl,
          basePrice: Number(p.basePrice || 0),
          stats: {
            runs: Number(p.runs || 0),
            average: Number(p.average || 0),
            strikeRate: Number(p.strikeRate || 0),
            fifties: Number(p.fifties || 0),
            hundreds: Number(p.hundreds || 0),
          },
        });
      });

      auction.players.push(...Object.values(grouped));
    }

    await auction.save();

    res.status(200).json({
      message: "Players & franchises added successfully",
      auction,
    });

  } catch (err) {
    console.error("Add players error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getAllAuctions = async (req , res) => {
  console.log("Get All Auctions Request by Admin:" );
    try{
        const details = await Auction.find()
        if (!details){
            return res.status(200).json([])
        }
        return res.status(200).json({message:"all auctions",details})
    }catch(e){
        return res.status(500).json({message:"server error"})
    }
}

export const getAuctionDetails = async (req ,res) => {
  try{
    const {auction_id} = req.body

    const existingAuction = await Auction.findById(auction_id)

    if(!existingAuction){
      return res.status(400).json({message:"no auction found"})
    }
    return res.status(200).json({message:"auction details",existingAuction})
  }catch(e){
    return res.status(500).json({message:"server error",e})
  }
}

export const startAuction = async (req, res) => {
  try {
    const { auction_id } = req.body;
    const auction = await Auction.findById(auction_id);
    

    if (!auction) return res.status(404).json("Auction Not Found");
    if (auction.status !== "upcoming") return res.status(400).json("Already Live");

    
    auction.currentSet = 0;
    auction.currentPlayerIndex = 0;

    
      const set = auction.players[0];
      const player = set.playersList[0];

      const newData = {
        playerId: player._id,
        name: player.name,
        basePrice: player.basePrice,
        setNo: set.setNo,
        role:player.role,
        imageUrl:player.imageUrl,
        matches:player.stats.matches,
        innings:player.stats.innings,
        runs:player.stats.runs,
        highestScore:player.stats.highestScore,
        average:player.stats.average,
        strikeRate:player.stats.strikeRate,
        fifties:player.stats.fifties,
        hundreds:player.stats.hundreds  
      };

    await auction.save(); 

      const io = req.app.get("io");
      console.log("Rooms", io.sockets.adapter.rooms)
      console.log("auctionid",auction_id)

      io.to(auction_id).emit("auction-started",
        {
        auctionId: auction._id,
        currentPlayer: newData,
        status: "live",
        
      });

      
      startTimer(auction_id,io)
    return res.status(200).json("Auction started");

  } catch (err) {
    console.log(err);
    return res.status(500).json("Internal error");
  }
};

export const getTeams = async(req,res) => {
  
  const {auctionId}  = req.body
  const auction = await Auction.findById(auctionId)
  
  if (!auction){
    return res.status(400).json("No Auction Are exsisted")
  }
  
  return res.status(200).json({data:auction.franchises})
}

export const getAuctionStatus = async(req,res) => {
  const auctionId = req.query.auctionId
  console.log(auctionId)

  const auction = await Auction.findById(auctionId)

  if (!auction) {
    return res.status(400).json("Auction DoesNot Exist")
  }

  res.status(200).json({status:auction.status})
}