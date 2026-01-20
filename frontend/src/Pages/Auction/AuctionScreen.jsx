import React, { useEffect, useState } from "react";
import { socket } from "../../Socket/socket.js";
import { useLocation, useNavigate } from "react-router-dom";
import AdminNavBar from "../../Components/AdminComponent/AdminNavBar.jsx";
import axios from "axios";

const DOMAIN = import.meta.env.VITE_DOMAIN;

const AuctionScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [player, setPlayer] = useState(null);

  const { auction } = location.state || "";
  const { auctionId, currentPlayer } = auction;

  const [currentBid, setCurrentBid] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isAuctionPause, setAuctionPause] = useState(false);
  const [showEndAutionModel, setEndAuctionModel] = useState(false);
  const [showPauseAuctionModel, setPauseAuctionModel] = useState(false);
  const [showResumeAuctionModel, setResumeAuctionModel] = useState(false);

  const fetchedData = async () => {
    try {
      const response = await axios.get(
        `${DOMAIN}/auction/auction-status?auctionId=${auctionId}`,
      );
      if (response.status === 200) {
        if (response.data.status === "upcoming") {
          setAuctionPause(false);
        }
        if (response.data.status === "paused") {
          setAuctionPause(true);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchedData();
    if (auctionId) socket.emit("join-auction", auctionId);

    socket.on("resume-auction", () => {
      setAuctionPause(false);
      setResumeAuctionModel(false);
    });

    socket.on("timer-update", (data) => setTimer(data.timeLeft));
    socket.on("bid-updated", (data) => setCurrentBid(data.bid));

    socket.on("new-player", (data) => {
      setPlayer(data.currentPlayer);
      setTimer(data.timeLeft);
      setCurrentBid(data.currentPlayer.basePrice);
    });

    socket.on("auction-ended", () => navigate("/admin/auction/ended"));

    socket.on("auction-paused", (time, currentBid, currentPlayer) => {
      setAuctionPause(true);
      console.log(time, currentBid, currentPlayer);
    });

    return () => {
      socket.off("timer-update");
      socket.off("bid-updated");
      socket.off("new-player");
    };
  }, []);

  const pauseAuction = () => {
    setPauseAuctionModel(true);
  };

  const endAuction = () => {
    setEndAuctionModel(true);
  };

  const getResumeAuction = () => {
    setResumeAuctionModel(true);
  };

  const confirmEndAuction = () => {
    const auctionId = localStorage.getItem("auctionId");
    socket.emit("end-auction",{auctionId})
    setEndAuctionModel(false)
    // navigate("/admin/auction/ended");
  };

  const confirmPauseAuction = () => {
    const auctionId = localStorage.getItem("auctionId");
    socket.emit("pause-auction", {
      auctionId,
      timer,
    });
    setPauseAuctionModel(false);
  };

  const confirmResumeAuction = () => {
    const auctionId = localStorage.getItem("auctionId");
    socket.emit("resume-auction", {
      auctionId,
    });
    setResumeAuctionModel(false);
  };

  const displayPlayer = player || currentPlayer;

  const dummyImg =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTK38tEeJiYTWzabBXNBoRta9hhg6G8eZvEA&s";

  return (
    <div className="min-h-screen min-w-screen bg-gray-100 flex flex-col items-center ">
      <AdminNavBar />
      <h2 className="text-3xl font-bold mb-6 mt-6 tracking-wide">
        Live Auction
      </h2>

      {displayPlayer && (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden max-w-3xl w-full flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 p-3 flex justify-center items-center">
            <img
              src={dummyImg}
              alt="player"
              className="rounded-lg object-cover w-48 h-56 md:w-56 md:h-72"
            />
          </div>

          <div className="w-full md:w-2/3 p-4">
            <h3 className="text-2xl font-semibold">{displayPlayer.name}</h3>
            <p className="text-gray-600 mb-3">{displayPlayer.role}</p>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <p>
                <span className="font-medium">Matches:</span>{" "}
                {displayPlayer.matches}
              </p>
              <p>
                <span className="font-medium">Innings:</span>{" "}
                {displayPlayer.innings}
              </p>
              <p>
                <span className="font-medium">Runs:</span> {displayPlayer.runs}
              </p>
              <p>
                <span className="font-medium">Highest:</span>{" "}
                {displayPlayer.highestScore}
              </p>
              <p>
                <span className="font-medium">Average:</span>{" "}
                {displayPlayer.average}
              </p>
              <p>
                <span className="font-medium">Strike Rate:</span>{" "}
                {displayPlayer.strikeRate}
              </p>
              <p>
                <span className="font-medium">50s:</span>{" "}
                {displayPlayer.fifties}
              </p>
              <p>
                <span className="font-medium">100s:</span>{" "}
                {displayPlayer.hundreds}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-6 mt-6 justify-center">
        <div className="bg-white shadow rounded-xl p-3 w-32 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Time Left
          </p>
          <p className="text-xl font-bold text-red-600">{timer}s</p>
        </div>

        <div className="bg-white shadow rounded-xl p-3 w-32 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Current Bid
          </p>
          <p className="text-xl font-bold text-blue-600">₹{currentBid}</p>
        </div>
      </div>

      {isAuctionPause ? (
        <button
          onClick={getResumeAuction}
          className="mt-6 !bg-green-600 hover:!bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition shadow"
        >
          Resume Auction
        </button>
      ) : (
        <div className="flex gap-4">
          <button
            onClick={pauseAuction}
            className="mt-6 !bg-blue-600 hover:!bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition shadow"
          >
            Pause Auction
          </button>
          <button
            onClick={endAuction}
            className="mt-6 !bg-red-500 hover:!bg-red-600 text-white font-semibold px-6 py-2 rounded-lg transition shadow"
          >
            End Auction
          </button>
        </div>
      )}
      {showPauseAuctionModel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="!bg-white rounded-xl shadow-xl p-6 w-[350px]">
            <h2 className="text-xl font-semibold mb-4">Pause Auction?</h2>

            <p className="text-gray-600 mb-5">
              Are you sure you want to pause the auction?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPauseAuctionModel(false)}
                className="px-4 py-2 rounded !bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={confirmPauseAuction}
                className="px-4 py-2 rounded !bg-blue-600 text-white hover:!bg-blue-700"
              >
                Pause
              </button>
            </div>
          </div>
        </div>
      )}

      {showEndAutionModel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="!bg-white rounded-xl shadow-xl p-6 w-[350px]">
            <h2 className="text-xl font-semibold mb-4">End Auction?</h2>

            <p className="text-gray-600 mb-5">
              Are you sure you want to End the auction?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEndAuctionModel(false)}
                className="px-4 py-2 rounded !bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={confirmEndAuction}
                className="px-4 py-2 rounded !bg-red-600 text-white hover:!bg-red-700"
              >
                End
              </button>
            </div>
          </div>
        </div>
      )}

      {showResumeAuctionModel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="!bg-white rounded-xl shadow-xl p-6 w-[350px]">
            <h2 className="text-xl font-semibold mb-4">Resume Auction?</h2>

            <p className="text-gray-600 mb-5">
              Are you sure you want to Resume the auction?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setResumeAuctionModel(false)}
                className="px-4 py-2 rounded !bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={confirmResumeAuction}
                className="px-4 py-2 rounded !bg-green-600 text-white hover:!bg-green-700"
              >
                Resume
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionScreen;
