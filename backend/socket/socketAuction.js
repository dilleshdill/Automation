import { Auction } from "../models/auctionModel.js";

let timers = {};
export const runningAuctions = {};

export const registerAuctionSocketEvents = (io) => {
  io.on("connection", (socket) => {
    socket.on("join-auction", async (auctionId) => {
      socket.join(auctionId);
      runningAuctions[auctionId] = {
        timeLeft: 10,
        currentPlayer: "",
        currentBid: "",
        auctionStatus: "Live",
        currentBidder: "",
      };

      const auction = await Auction.findById(auctionId);
      if (!auction) return;

      const set = auction.players[auction.currentSet];
      const player = set?.playersList[auction.currentPlayerIndex];
      const newdata = {
        playerId: player._id || "",
        name: player.name,
        basePrice: player.basePrice,
        setNo: set.setNo,
        role: player.role,
        imageUrl: player.imageUrl,
        matches: player.stats.matches,
        innings: player.stats.innings,
        runs: player.stats.runs,
        highestScore: player.stats.highestScore,
        average: player.stats.average,
        strikeRate: player.stats.strikeRate,
        fifties: player.stats.fifties,
        hundreds: player.stats.hundreds,
      };

      io.to(socket.id).emit("state-sync", {
        currentPlayer: newdata,
        currentBid: auction.currentBid,
        currentBidder: auction.currentBidder,
        timeLeft: runningAuctions[auctionId].timeLeft,
        auctionStatus: runningAuctions[auctionId].auctionStatus,
      });

      const newauction = await Auction.findById(auctionId);

      if (!auction) {
        io.to(auctionId).emit("upcomingPlayer-error");
      }

      const setNo = newauction.currentSet;
      const indexNo = newauction.currentPlayerIndex;

      const players = newauction.players.filter((each) => each.setNo === setNo);

      if (!players) {
        io.to(auctionId).emit("upcomingPlayer-error");
      }

      const upcomingPlayers = players[0].playersList.filter(
        (each, index) => index > indexNo,
      );

      io.to(auctionId).emit("upcomingPlayer-success", upcomingPlayers);
    });

    socket.on("place-bid", async ({ auctionId, bid, teamName, teamId }) => {
      console.log("socket props detailes", auctionId, bid, teamName, teamId);
      const auction = await Auction.findById(auctionId);

      if (!auction) return;
      const team = auction.franchises.find((f) => f._id.toString() === teamId);

      if (!team) {
        console.log("not mathces with id");
        return;
      }
      if (team.purse < bid) {
        runningAuctions[auctionId].currentBid = bid;
        runningAuctions[auctionId].currentBidder = teamId;
        io.to(auctionId).emit("bid-error", "Not Enough Purse");
        return;
      }

      auction.currentBid = bid;
      auction.currentBidder = teamId;
      await auction.save();
      io.to(auctionId).emit("bid-updated", {
        bid,
        bidderId: teamName,
      });
      startTimer(auctionId, io);
    });

    socket.on("pause-auction", async ({ auctionId, timer }) => {
      clearInterval(timers[auctionId]);

      runningAuctions[auctionId].auctionStatus = "Pause";
      runningAuctions[auctionId].timeLeft = timer;

      io.to(auctionId).emit("auction-paused", {
        timer,
        currentBid: runningAuctions[auctionId].currentBid,
        currentPlayer: runningAuctions[auctionId].currentPlayer,
      });

      const auction = await Auction.findById(auctionId);
      auction.status = "paused";
      await auction.save();
    });

    socket.on("resume-auction", async ({ auctionId }) => {
      const auction = await Auction.findById(auctionId);
      auction.status = "live";
      await auction.save();
      runningAuctions[auctionId].auctionStatus = "Live";
      io.to(auctionId).emit("resume-auction");
      startTimer(auctionId, io);
    });

    socket.on("end-auction", async ({ auctionId }) => {
      const auction = await Auction.findById(auctionId);
      auction.status = "ended";
      await auction.save();
      // runningAuctions[auctionId].auctionStatus = "ended"
      io.to(auctionId).emit("auction-ended");
    });

    socket.on("franchise-join", async ({ id, teamName }) => {
      const auctionId = id;
      try {
        const auction = await Auction.findById(auctionId);
        if (!auction) return socket.emit("join-error", "Auction not found");

        if (auction.status === "live") {
          return socket.emit("join-error", "Auction already live");
        }

        socket.teamName = teamName;
        socket.auctionId = auctionId;

        socket.join(auctionId);

        const set = auction.players[auction.currentSet];
        const player = set?.playersList[auction.currentPlayerIndex];

        const newdata = {
          playerId: player._id,
          name: player.name,
          basePrice: player.basePrice,
          setNo: set.setNo,
          role: player.role,
          imageUrl: player.imageUrl,
          matches: player.stats.matches,
          innings: player.stats.innings,
          runs: player.stats.runs,
          highestScore: player.stats.highestScore,
          average: player.stats.average,
          strikeRate: player.stats.strikeRate,
          fifties: player.stats.fifties,
          hundreds: player.stats.hundreds,
        };

        io.to(socket.id).emit("state-sync", {
          currentPlayer: newdata,
          currentBid: auction.currentBid,
          currentBidder: auction.currentBidder,
          timeLeft: runningAuctions[auctionId].timeLeft,
          auctionStatus: runningAuctions[auctionId].auctionStatus,
        });

        const newauction = await Auction.findById(auctionId);

        if (!auction) {
          io.to(auctionId).emit("upcomingPlayer-error");
        }

        const setNo = newauction.currentSet;
        const indexNo = newauction.currentPlayerIndex;

        const players = newauction.players.filter(
          (each) => each.setNo === setNo,
        );

        if (!players) {
          io.to(auctionId).emit("upcomingPlayer-error");
        }

        const upcomingPlayers = players[0].playersList.filter(
          (each, index) => index > indexNo,
        );

        io.to(auctionId).emit("upcomingPlayer-success", upcomingPlayers);

        socket.emit("join-success", "Successfully joined");
        socket.to(auctionId).emit("team-joined", teamName);
      } catch (err) {
        console.log(err);
      }
    });
  });
};

export const startTimer = (auctionId, io) => {
  if (runningAuctions[auctionId].auctionStatus === "Live") {
    clearInterval(timers[auctionId]);
    let timeLeft = runningAuctions[auctionId].timeLeft || 10;

    timers[auctionId] = setInterval(async () => {
      timeLeft--;

      io.to(auctionId).emit("timer-update", { timeLeft });
      if (timeLeft <= 0) {
        runningAuctions[auctionId].timeLeft = 10;
        clearInterval(timers[auctionId]);
        await closeBidding(auctionId, io);
      }
    }, 1000);
  }
};

async function closeBidding(auctionId, io) {
  const auction = await Auction.findById(auctionId);
  const set = auction.players[auction.currentSet];
  const player = set.playersList[auction.currentPlayerIndex];

  if (auction.currentBid > 0) {
    player.status = "sold";
    player.soldTo = auction.currentBidder;
    player.soldPrice = auction.currentBid;

    const franchise = auction.franchises.find((f) =>
      f._id.equals(auction.currentBidder),
    );
    franchise.players.push({
      playerId: player._id,
      name: player.name,
      soldPrice: auction.currentBid,
      setNo: auction.currentSet,
    });

    franchise.purse -= auction.currentBid;
  } else {
    player.status = "unsold";
  }

  await auction.save();

  io.to(auctionId).emit("player-result", {
    player,
    result: player.status,
  });

  setTimeout(() => moveNextPlayer(auctionId, io), 2000);
}

async function moveNextPlayer(auctionId, io) {
  const auction = await Auction.findById(auctionId);
  let set = auction.players[auction.currentSet];
  console.log("set", set);

  auction.currentPlayerIndex++;

  if (auction.currentPlayerIndex >= set.playersList.length) {
    auction.currentSet++;
    auction.currentPlayerIndex = 0;

    if (auction.currentSet >= auction.players.length) {
      // auction.status = "ended";
      // await auction.save();
      io.to(auctionId).emit("auction-ended");
      return;
    }

    set = auction.players[auction.currentSet];
  }

  const nextPlayer = set.playersList[auction.currentPlayerIndex];

  const newdata = {
    playerId: nextPlayer._id,
    name: nextPlayer.name,
    basePrice: nextPlayer.basePrice,
    setNo: set.setNo,
    role: nextPlayer.role,
    imageUrl: nextPlayer.imageUrl,
    matches: nextPlayer.stats.matches,
    innings: nextPlayer.stats.innings,
    runs: nextPlayer.stats.runs,
    highestScore: nextPlayer.stats.highestScore,
    average: nextPlayer.stats.average,
    strikeRate: nextPlayer.stats.strikeRate,
    fifties: nextPlayer.stats.fifties,
    hundreds: nextPlayer.stats.hundreds,
  };

  auction.currentBid = 0;
  auction.currentBidder = null;

  await auction.save();

  io.to(auctionId).emit("new-player", {
    currentPlayer: newdata,
    timeLeft: 30,
  });

  const newauction = await Auction.findById(auctionId);

  if (!auction) {
    io.to(auctionId).emit("upcomingPlayer-error");
  }

  const setNo = newauction.currentSet;
  const indexNo = newauction.currentPlayerIndex;

  const players = newauction.players.filter((each) => each.setNo === setNo);

  if (!players) {
    io.to(auctionId).emit("upcomingPlayer-error");
  }

  const upcomingPlayers = players[0].playersList.filter(
    (each, index) => index > indexNo,
  );

  io.to(auctionId).emit("upcomingPlayer-success", upcomingPlayers);

  startTimer(auctionId, io);
}
