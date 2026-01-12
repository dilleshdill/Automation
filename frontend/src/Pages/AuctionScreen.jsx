import React, { useEffect, useState } from "react";
import { socket } from "../Socket/socket.js";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AuctionScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [player, setPlayer] = useState(null);
  const { auction } = location.state || "";
  const { auctionId, currentPlayer } = auction;

  const [currentBid, setCurrentBid] = useState(0);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (auctionId) {
      socket.emit("join-auction", auctionId);
    }

    socket.on("timer-update", (data) => {
      setTimer(data.timeLeft);
    });

    socket.on("bid-updated", (data) => {
      setCurrentBid(data.bid);
    });

    socket.on("player-result", (data) => {
      console.log(data.currentPlayer);
    });

    socket.on("new-player", (data) => {
      setPlayer(data.currentPlayer);
      setTimer(data.timeLeft);
      setCurrentBid(data.currentPlayer.basePrice);
    });

    socket.on("auction-ended", () => {
      navigate("/auction/ended");
    });

    return () => {
      socket.off("auction-started");
      socket.off("timer-update");
      socket.off("bid-updated");
    };
  }, []);

  const placeBid = () => {
    toast.info("enter into the placebid function");
    socket.emit("place-bid", {
      auctionId,
      bid: currentBid + 100000,
    });
  };

  const displayPlayer = player || currentPlayer;
  const dummyImage =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTK38tEeJiYTWzabBXNBoRta9hhg6G8eZvEA&s";

  return (
    <div className="p-4 flex flex-col items-center bg-gray-100 min-w-screen text-center">
      <h2 className="text-2xl font-bold mb-4">Auction Screen</h2>

      {displayPlayer && (
        <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-md">
          <img
            src={dummyImage}
            alt="player"
            className="w-full rounded-lg mb-4 object-cover"
          />

          <h3 className="text-xl font-semibold">{displayPlayer.name}</h3>
          <p className="text-sm text-gray-500 mb-2">{displayPlayer.role}</p>

          <div className="grid grid-cols-2 gap-2 text-left text-sm">
            <p><strong>Base Price:</strong> {displayPlayer.basePrice}</p>
            <p><strong>Matches:</strong> {displayPlayer.matches}</p>
            <p><strong>Innings:</strong> {displayPlayer.innings}</p>
            <p><strong>Runs:</strong> {displayPlayer.runs}</p>
            <p><strong>Highest:</strong> {displayPlayer.highestScore}</p>
            <p><strong>Avg:</strong> {displayPlayer.average}</p>
            <p><strong>Strike Rate:</strong> {displayPlayer.strikeRate}</p>
            <p><strong>50s:</strong> {displayPlayer.fifties}</p>
            <p><strong>100s:</strong> {displayPlayer.hundreds}</p>
          </div>
        </div>
      )}

      <p className="mt-4 text-lg font-semibold">
        Time Remaining: <span className="text-red-600">{timer}s</span>
      </p>

      <p className="mt-2 text-lg">
        Current Bid: <span className="font-bold">₹{currentBid}</span>
      </p>

      <button
        onClick={placeBid}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
      >
        Place Bid
      </button>
    </div>
  );
};

export default AuctionScreen;
