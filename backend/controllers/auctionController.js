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
  console.log("Incoming body:", req.body);

  try {
    const { auctionId, franchises, players } = req.body;

    if (!auctionId) {
      return res.status(400).json({ message: "Auction ID is required" });
    }

    // 1️⃣ Find auction by MongoDB _id
    const auction = await Auction.findById(auctionId);

    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    // 2️⃣ ADD FRANCHISES
    if (Array.isArray(franchises) && franchises.length > 0) {
      const formattedFranchises = franchises.map(f => ({
        teamName: f.teamName,
        email: f.email,
        password: f.password, // ⚠️ hash later
        purse: Number(f.purse),
        players: [],
      }));

      auction.franchises.push(...formattedFranchises);
    }

// 3️⃣ ADD PLAYERS (FILTER EMPTY ONES)
if (Array.isArray(players)) {
  const validPlayers = players.filter(
    p =>
      p.name &&
      p.battingStyle &&
      p.country &&
      p.imageUrl
  );

  const formattedPlayers = validPlayers.map(p => ({
    name: p.name,
    role: p.battingStyle,
    country: p.country,
    imageUrl: p.imageUrl,
    basePrice: Number(p.basePrice || 0),
    setNo: Number(p.setNo || 0),
    stats: {
      runs: Number(p.runs || 0),
      average: Number(p.average || 0),
      strikeRate: Number(p.strikeRate || 0),
      fifties: Number(p.fifties || 0),
      hundreds: Number(p.hundreds || 0),
    },
  }));

  auction.players.push(...formattedPlayers);
}

    // 4️⃣ Save auction
    await auction.save();

    return res.status(200).json({
      message: "Players and franchises added successfully",
      auction,
    });

  } catch (error) {
    console.error("Add players/franchises error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllAuctions = async (req , res) => {
    try{
        const details = await Auction.find()
        if (!details){
            return res.stats(200).json([])
        }
        return res.stats(200).json({message:"all auctions",details})
    }catch(e){
        return res.stats(500).json({message:"server error"})
    }
}..