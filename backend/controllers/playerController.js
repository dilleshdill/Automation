import { Auction } from "../models/auctionModel.js";

export const addPlayer = async (req, res) => {
  try {
    const { auctionId, players } = req.body;

    const auction = await Auction.findById(auctionId);

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

    await auction.save();

    res.status(200).json({ message: "Players added successfully", auction });

  } catch (error) {
    console.error("addPlayers error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
