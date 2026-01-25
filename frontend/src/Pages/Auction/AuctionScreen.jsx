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

  const { auction } = location.state || {};
  const { auctionId, currentPlayer } = auction;

  const [currentBid, setCurrentBid] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isAuctionPause, setAuctionPause] = useState(false);
  const [showEndAuctionModel, setEndAuctionModel] = useState(false);
  const [showPauseAuctionModel, setPauseAuctionModel] = useState(false);
  const [showResumeAuctionModel, setResumeAuctionModel] = useState(false);
  

  const fetchedData = async () => {
    try {
      const response = await axios.get(
        `${DOMAIN}/auction/auction-status?auctionId=${auctionId}`
      );
      if (response.status === 200) {
        if (response.data.status === "upcoming") setAuctionPause(false);
        if (response.data.status === "paused") setAuctionPause(true);
      }
    } catch (err) {
      console.log(err)
    }
  };

  
  useEffect(() => {
    fetchedData();
    
    if (auctionId) socket.emit("join-auction", auctionId);

    socket.on("resume-auction", () => {
      setAuctionPause(false);
      setResumeAuctionModel(false);
    });

    socket.on("state-sync", ({ currentPlayer }) => {
      setPlayer(currentPlayer);
    });

    socket.on("timer-update", (data) => setTimer(data.timeLeft));
    socket.on("bid-updated", (data) => setCurrentBid(data.bid));

    socket.on("new-player", (data) => {
      setPlayer(data.currentPlayer);
      setTimer(data.timeLeft);
      setCurrentBid(data.currentPlayer.basePrice);
    });

    socket.on("auction-ended", () => navigate("/admin/auction/ended"));
    socket.on("auction-paused", () => setAuctionPause(true));
  }, []);

  const pauseAuction = () => setPauseAuctionModel(true);
  const endAuction = () => setEndAuctionModel(true);
  const getResumeAuction = () => setResumeAuctionModel(true);

  const confirmEndAuction = () => {
    socket.emit("end-auction", auctionId);
    setEndAuctionModel(false);
  };

  const confirmPauseAuction = () => {
    socket.emit("pause-auction", { auctionId, timer });
    setPauseAuctionModel(false);
  };

  const confirmResumeAuction = () => {
    socket.emit("resume-auction", { auctionId });
    setResumeAuctionModel(false);
  };

  const displayPlayer = player || currentPlayer;

  return (
    <div className="min-h-screen min-w-screen bg-[#f6f7f9] flex flex-col">
      <AdminNavBar />

      <div className="flex flex-col items-center mt-10">
        <h2 className="text-3xl font-semibold text-slate-800 tracking-wide">
          Live Auction
        </h2>

        {displayPlayer && (
          <div
            className="
            mt-8 w-full max-w-4xl bg-white rounded-2xl shadow-md
            border border-slate-200 p-6 flex flex-col md:flex-row gap-6
          "
          >
            {/* IMAGE */}
            <div className="flex justify-center w-full md:w-1/3">
              <img
                src={displayPlayer.imageUrl}
                alt="player"
                className="rounded-xl object-cover w-56 h-72 shadow-sm"
              />
            </div>

            {/* DETAILS */}
            <div className="w-full md:w-2/3 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold text-slate-800">
                  {displayPlayer.name}
                </h3>
                <span className="text-xs px-3 py-1 rounded-full border border-slate-300 text-slate-600">
                  {displayPlayer.role}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm text-slate-700">
                <Info label="Matches" value={displayPlayer.matches} />
                <Info label="Innings" value={displayPlayer.innings} />
                <Info label="Runs" value={displayPlayer.runs} />
                <Info label="Highest" value={displayPlayer.highestScore} />
                <Info label="Average" value={displayPlayer.average} />
                <Info label="Strike Rate" value={displayPlayer.strikeRate} />
                <Info label="50s" value={displayPlayer.fifties} />
                <Info label="100s" value={displayPlayer.hundreds} />
              </div>
            </div>
          </div>
        )}

        {/* BID PANEL */}
        <div className="flex gap-6 mt-8">
          <Panel title="Time Left" value={timer + 's'} color="text-red-600" />
          <Panel title="Current Bid" value={'₹' + currentBid} color="text-blue-600" />
        </div>

        {/* ACTION BUTTONS */}
        {isAuctionPause ? (
          <button
            onClick={getResumeAuction}
            className="
              mt-6 px-8 py-2 rounded-lg
              text-white font-medium shadow
              !bg-[#22a447] hover:!bg-[#1b8c3b]
              transition
            "
          >
            Resume Auction
          </button>
        ) : (
          <div className="flex gap-4 mt-6">
            <button
              onClick={pauseAuction}
              className="
                px-8 py-2 rounded-lg text-white font-medium shadow
                !bg-[#0052cc] hover:!bg-[#003f99]
                transition
              "
            >
              Pause Auction
            </button>
            <button
              onClick={endAuction}
              className="
                px-8 py-2 rounded-lg text-white font-medium shadow
                !bg-[#d03838] hover:!bg-[#b82f2f]
                transition
              "
            >
              End Auction
            </button>
          </div>
        )}
      </div>

      {/* MODALS */}
      {showPauseAuctionModel && (
        <GlassModal
          title="Pause Auction?"
          confirm="Pause"
          color="blue"
          onCancel={() => setPauseAuctionModel(false)}
          onConfirm={confirmPauseAuction}
        />
      )}

      {showEndAuctionModel && (
        <GlassModal
          title="End Auction?"
          confirm="End"
          color="red"
          onCancel={() => setEndAuctionModel(false)}
          onConfirm={confirmEndAuction}
        />
      )}

      {showResumeAuctionModel && (
        <GlassModal
          title="Resume Auction?"
          confirm="Resume"
          color="green"
          onCancel={() => setResumeAuctionModel(false)}
          onConfirm={confirmResumeAuction}
        />
      )}
    </div>
  );
};

const Info = ({ label, value }) => (
  <p>
    <span className="text-slate-500">{label}: </span>
    <span className="font-medium">{value}</span>
  </p>
);

const Panel = ({ title, value, color }) => (
  <div className="w-32 bg-white border border-slate-200 shadow-sm rounded-xl p-3 text-center">
    <p className="text-xs text-slate-500 uppercase tracking-wider">{title}</p>
    <p className={`text-xl font-semibold ${color}`}>{value}</p>
  </div>
);

const GlassModal = ({ title, confirm, color, onCancel, onConfirm }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm z-50">
    <div className="w-[330px] rounded-xl bg-white shadow-lg p-6 border border-slate-200">
      <h2 className="text-lg font-semibold text-slate-800 mb-3">{title}</h2>
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-md border border-slate-300 hover:bg-slate-100"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className={`px-4 py-2 rounded-md text-white font-medium ${
            color === "blue" && "!bg-[#0052cc]"
          } ${color === "red" && "!bg-[#d03838]"} ${
            color === "green" && "!bg-[#22a447]"
          }`}
        >
          {confirm}
        </button>
      </div>
    </div>
  </div>
);

export default AuctionScreen;
