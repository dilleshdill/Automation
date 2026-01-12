import { Auction } from "../models/auctionModel.js";

let timers = {};

export const registerAuctionSocketEvents = (io) => {
  io.on("connection", (socket) => {

    socket.on("place-bid", async ({ auctionId, bid }) => {
        console.log("enter into the placebid")
        const auction = await Auction.findById(auctionId);

        if (!auction) return;
        if (bid <= auction.currentBid) return;
        console.log(socket.bidder)
        auction.currentBid = bid;
        auction.currentBidder = socket.bidder.bidderId;
        await auction.save();
        console.log("Rooms", io.socket.adapter.rooms)
        io.to(auctionId).emit("bid-updated", {
            bid,
            bidderId: socket.bidder.bidderId
        });
    });
  });
};

// TIMER
export const startTimer = (auctionId, io)=>{
  let timeLeft = 7;

  timers[auctionId] = setInterval(async () => {
    timeLeft--;
    io.to(auctionId).emit("timer-update", { timeLeft });
    if (timeLeft <= 0) {
      clearInterval(timers[auctionId]);
      await closeBidding(auctionId, io);
    }
  }, 1000);
}

async function closeBidding(auctionId, io) {
  const auction = await Auction.findById(auctionId);
  const set = auction.players[auction.currentSet];
  const player = set.playersList[auction.currentPlayerIndex];

  if (auction.currentBid > 0) {
    player.status = "sold";
    player.soldTo = auction.currentBidder;
    player.soldPrice = auction.currentBid;

    const franchise = auction.franchises.find(f => f._id.equals(auction.currentBidder));
    franchise.players.push({
      playerId: player._id,
      name: player.name,
      soldPrice: auction.currentBid,
      setNo: auction.currentSet
    });

    franchise.purse -= auction.currentBid;
  } else {
    player.status = "unsold";
  }

  await auction.save();

  io.to(auctionId).emit("player-result", {
    player,
    result: player.status
  });

  setTimeout(() => moveNextPlayer(auctionId, io), 2000);
}

async function moveNextPlayer(auctionId, io) {
    const auction = await Auction.findById(auctionId);
    let set = auction.players[auction.currentSet];
    console.log("set",set)

    auction.currentPlayerIndex++;

    if (auction.currentPlayerIndex >= set.playersList.length) {
        auction.currentSet++;
        auction.currentPlayerIndex = 0;

        if (auction.currentSet >= auction.players.length) {
        auction.status = "upcoming";
        await auction.save();
        io.to(auctionId).emit("auction-ended");
        return
        }

        set = auction.players[auction.currentSet];
    }

    const nextPlayer = set.playersList[auction.currentPlayerIndex];
    console.log("this is nextplayer detailes",nextPlayer)
    const newdata  = {
        playerId: nextPlayer._id,
        name: nextPlayer.name,
        basePrice: nextPlayer.basePrice,
        setNo: set.setNo,
        role:nextPlayer.role,
        imageUrl:nextPlayer.imageUrl,
        matches:nextPlayer.stats.matches,
        innings:nextPlayer.stats.innings,
        runs:nextPlayer.stats.runs,
        highestScore:nextPlayer.stats.highestScore,
        average:nextPlayer.stats.average,
        strikeRate:nextPlayer.stats.strikeRate,
        fifties:nextPlayer.stats.fifties,
        hundreds:nextPlayer.stats.hundreds  
    };
    
    auction.currentBid = 0;
    auction.currentBidder = null;

    await auction.save();

    io.to(auctionId).emit("new-player", {
        currentPlayer: newdata,
        timeLeft: 30
    });

    startTimer(auctionId, io);
    }
