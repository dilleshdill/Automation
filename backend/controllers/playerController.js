import { Auction } from "../models/auctionModel.js";

export const addPlayer = async (req, res) => {
  try {
    const { auctionId, players } = req.body;
    console.log("Incoming:", auctionId, players);

    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    const grouped = {};

    players.map((p) => {
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
        status: "unsold",
        soldTo: null,
        soldPrice: 0,
      });
    });

    
    const incomingSets = Object.values(grouped);

    incomingSets.forEach((incomingSet) => {
      const existingSet = auction.players.find(
        (s) => s.setNo === incomingSet.setNo
      );

      if (existingSet) {
        // Append players (avoid duplicates if needed)
        existingSet.playersList.push(...incomingSet.playersList);
      } else {
        // Create new set
        auction.players.push(incomingSet);
      }
    });

    await auction.save();

    return res
      .status(200)
      .json({ message: "Players added successfully", auction });

  } catch (error) {
    console.error("addPlayer error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPlayer = async(req,res) => {
  
  const {id,auctionId,setNo} = req.body
  // console.log("player detailes",id,auctionId,setNo)
  const auction = await Auction.findById(auctionId)
  if (!auction){
    return res.status(400).json("Auction DoesNot Exist")
  }
  const setPlayers = auction.players.filter(sets => sets.setNo === setNo)
  if(!setPlayers){
    return res.status(400).json("Player Doesnot Exist")
  }
  const Players = setPlayers[0].playersList
  
  const data = Players.filter(player => player._id.toString() === id)
  if (!data){
    return res.status(400).json("Player Doesnot Exist")
  }
  res.status(200).json(data)

}