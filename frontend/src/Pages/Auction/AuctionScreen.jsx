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

  // Get role badge color
  const getRoleColor = (role) => {
    const roles = {
      'batsman': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'bowler': 'bg-green-500/20 text-green-300 border-green-500/30',
      'all-rounder': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'wicket-keeper': 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    };
    return roles[role?.toLowerCase()] || 'bg-white/10 text-white/70 border-white/20';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <AdminNavBar />

      {/* Stadium Lights Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-64 h-1 bg-yellow-400/30 blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-1/4 w-64 h-1 bg-blue-400/30 blur-xl animate-pulse delay-300"></div>
      </div>

      {/* Moving Spotlight */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-full bg-gradient-to-r from-yellow-500/5 via-transparent to-transparent -skew-x-12 animate-spotlight-move"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 mb-2">
            ⚡ LIVE AUCTION ARENA ⚡
          </h1>
          <p className="text-white/50 text-sm tracking-wider">ADMIN CONTROL PANEL</p>
        </div>

        {displayPlayer && (
          <div
            className="
            backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl
            p-6 md:p-8 flex flex-col md:flex-row gap-8 relative overflow-hidden
          "
          >
            {/* Corner Stadium Lights */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-yellow-500/20 to-transparent"></div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-yellow-500/20 to-transparent"></div>

            {/* IMAGE */}
            <div className="flex justify-center w-full md:w-1/3">
              <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                
                {/* Image Container */}
                <div className="relative rounded-2xl overflow-hidden border-2 border-white/20 group-hover:border-yellow-400/50 transition-all">
                  <img
                    src={displayPlayer.imageUrl}
                    alt="player"
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                  
                  {/* Player Number Badge */}
                  {displayPlayer.jerseyNumber && (
                    <div className="absolute top-4 right-4 backdrop-blur-md bg-white/10 border border-white/20 px-3 py-1.5 rounded-full">
                      <span className="text-white font-bold">#{displayPlayer.jerseyNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* DETAILS */}
            <div className="w-full md:w-2/3 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400">
                  {displayPlayer.name}
                </h2>
                <span className={`px-4 py-1.5 text-sm font-bold rounded-full border ${getRoleColor(displayPlayer.role)}`}>
                  {displayPlayer.role?.toUpperCase()}
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Matches" value={displayPlayer.matches} icon="📊" />
                <StatCard label="Innings" value={displayPlayer.innings} icon="🏏" />
                <StatCard label="Runs" value={displayPlayer.runs} icon="⭐" />
                <StatCard label="Highest" value={displayPlayer.highestScore} icon="🎯" />
                <StatCard label="Average" value={displayPlayer.average} icon="📈" />
                <StatCard label="Strike Rate" value={displayPlayer.strikeRate} icon="⚡" />
                <StatCard label="50s" value={displayPlayer.fifties} icon="🎯" />
                <StatCard label="100s" value={displayPlayer.hundreds} icon="🏆" />
              </div>
            </div>
          </div>
        )}

        {/* BID PANEL */}
        <div className="flex justify-center gap-8 mt-8">
          <BidPanel title="Time Left" value={timer + 's'} color="from-red-500 to-orange-500" icon="⏱️" />
          <BidPanel title="Current Bid" value={'₹' + currentBid} color="from-green-500 to-emerald-500" icon="💰" />
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-center mt-8">
          {isAuctionPause ? (
            <button
              onClick={getResumeAuction}
              className="
                px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-500
                text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-600
                transition-all transform hover:scale-105 shadow-lg shadow-green-500/30
                flex items-center gap-2 text-lg
              "
            >
              <span className="text-2xl">▶️</span>
              RESUME AUCTION
            </button>
          ) : (
            <div className="flex gap-6">
              <button
                onClick={pauseAuction}
                className="
                  px-10 py-4 bg-gradient-to-r from-blue-500 to-indigo-500
                  text-white font-bold rounded-xl hover:from-blue-600 hover:to-indigo-600
                  transition-all transform hover:scale-105 shadow-lg shadow-blue-500/30
                  flex items-center gap-2 text-lg
                "
              >
                <span className="text-2xl">⏸️</span>
                PAUSE AUCTION
              </button>
              <button
                onClick={endAuction}
                className="
                  px-10 py-4 bg-gradient-to-r from-red-500 to-pink-500
                  text-white font-bold rounded-xl hover:from-red-600 hover:to-pink-600
                  transition-all transform hover:scale-105 shadow-lg shadow-red-500/30
                  flex items-center gap-2 text-lg
                "
              >
                <span className="text-2xl">🏁</span>
                END AUCTION
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
      {showPauseAuctionModel && (
        <GlassModal
          title="Pause Auction?"
          description="The auction will be paused immediately"
          confirm="PAUSE"
          color="blue"
          icon="⏸️"
          onCancel={() => setPauseAuctionModel(false)}
          onConfirm={confirmPauseAuction}
        />
      )}

      {showEndAuctionModel && (
        <GlassModal
          title="End Auction?"
          description="This action cannot be undone"
          confirm="END"
          color="red"
          icon="🏁"
          onCancel={() => setEndAuctionModel(false)}
          onConfirm={confirmEndAuction}
        />
      )}

      {showResumeAuctionModel && (
        <GlassModal
          title="Resume Auction?"
          description="The auction will continue from where it paused"
          confirm="RESUME"
          color="green"
          icon="▶️"
          onCancel={() => setResumeAuctionModel(false)}
          onConfirm={confirmResumeAuction}
        />
      )}

      <style jsx>{`
        @keyframes spotlight-move {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-spotlight-move {
          animation: spotlight-move 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

// Enhanced Stat Card Component
const StatCard = ({ label, value, icon }) => (
  <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <span className="text-white/50 text-xs">{label}</span>
      </div>
      <span className="text-lg font-bold text-white">
        {value !== undefined && value !== null && value !== "" ? value : "—"}
      </span>
    </div>
  </div>
);

// Enhanced Bid Panel Component
const BidPanel = ({ title, value, color, icon }) => (
  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 text-center min-w-[200px] relative overflow-hidden">
    <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10`}></div>
    <div className="relative">
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="text-2xl">{icon}</span>
        <p className="text-white/50 text-sm uppercase tracking-wider">{title}</p>
      </div>
      <p className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${color}`}>
        {value}
      </p>
    </div>
  </div>
);

// Enhanced Modal Component
const GlassModal = ({ title, description, confirm, color, icon, onCancel, onConfirm }) => {
  const getColorClasses = (color) => {
    const colors = {
      blue: 'from-blue-500 to-indigo-500 shadow-blue-500/30',
      red: 'from-red-500 to-pink-500 shadow-red-500/30',
      green: 'from-green-500 to-emerald-500 shadow-green-500/30'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center backdrop-blur-md z-50">
      <div className="w-[380px] backdrop-blur-xl bg-slate-800/90 border border-white/10 rounded-2xl shadow-2xl p-6 animate-fadeIn">
        <div className="text-center mb-4">
          <span className="text-4xl mb-3 block">{icon}</span>
          <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
          <p className="text-white/50 text-sm">{description}</p>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-lg border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-6 py-2.5 rounded-lg bg-gradient-to-r ${getColorClasses(color)} text-white font-bold transition-all transform hover:scale-105 shadow-lg`}
          >
            {confirm}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuctionScreen;