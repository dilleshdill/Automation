import { React, useEffect, useState } from "react";
import { socket } from "../../Socket/socket";
import { useNavigate, useLocation } from "react-router-dom";
import NavBar from "../../Components/Common/NavBar";
import Marquee from "react-fast-marquee";
import axios from "axios";
import UserUpcomingPlayer from "../../Components/User/UserUpcomingPlayer";
import { toast } from "react-toastify";

const DOMAIN = import.meta.env.VITE_DOMAIN;

const UserAuctionScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [player, setPlayer] = useState(null);
  const { data } = location.state || "";
  const { id, userId } = data;
  const auctionId = id;

  const [currentBid, setCurrentBid] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isAuctionPaused, setAuctionPause] = useState(false);
  const [isAuctionStart, setAuctionStart] = useState(false);
  const [showSoldAnimation, setShowSoldAnimation] = useState(false);
  const [soldPlayerData, setSoldPlayerData] = useState({ name: "", bidder: "", amount: 0 });
  const [showUnsoldAnimation, setShowUnsoldAnimation] = useState(false);
  const [unsoldPlayerName, setUnsoldPlayerName] = useState("");
  const [bidHistory, setBidHistory] = useState([]);
  const [showBidFlash, setShowBidFlash] = useState(false);

  localStorage.setItem("auctionId", auctionId);

  const fetchedData = async () => {
    try {
      const response = await axios.get(
        `${DOMAIN}/auction/auction-status?auctionId=${auctionId}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        if (response.data.status === "live") {
          setAuctionStart(true);
          setAuctionPause(false);
        }
        if (response.data.status === "paused") {
          setAuctionPause(true);
        }
        if (response.data.status === "ended") {
          navigate("/user/auction/ended");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchedData();

    socket.emit("join-auction", auctionId);

    socket.on(
      "state-sync",
      ({ currentPlayer, currentBid, currentBidder, timeLeft }) => {
        setPlayer(currentPlayer);
        setCurrentBid(currentBid);
        setTimer(timeLeft);
      }
    );

    socket.on("resume-auction", () => {
      setAuctionPause(false);
      setAuctionStart(true);
      toast.success("🎉 Auction Resumed!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          background: 'linear-gradient(to right, #10b981, #059669)',
          color: 'white',
          fontWeight: 'bold',
          borderRadius: '10px'
        }
      });
    });

    socket.on("auction-started", (auction) => {
      setPlayer(auction.currentPlayer);
      setAuctionStart(true);
      setAuctionPause(false);
      toast.success("🏏 Auction Started! Let the bidding begin!", {
        position: "top-center",
        style: {
          background: 'linear-gradient(to right, #3b82f6, #2563eb)',
          color: 'white'
        }
      });
    });

    socket.on("player-sold", ({ currentBidder, currentPlayer, amount }) => {
      // Show sold animation
      setSoldPlayerData({ 
        name: currentPlayer, 
        bidder: currentBidder,
        amount: amount || currentBid 
      });
      setShowSoldAnimation(true);
      
      // Add to bid history
      setBidHistory(prev => [{
        player: currentPlayer,
        bidder: currentBidder,
        amount: amount || currentBid,
        status: 'sold',
        time: new Date().toLocaleTimeString()
      }, ...prev].slice(0, 5));

      // Auto hide after 3 seconds
      setTimeout(() => setShowSoldAnimation(false), 3000);

      toast.info(`🎯 SOLD! ${currentPlayer} to ${currentBidder} for ₹${amount || currentBid}`, {
        position: "top-center",
        style: {
          background: 'linear-gradient(to right, #f59e0b, #d97706)',
          color: 'white'
        }
      });
    });

    socket.on("player-unsold", ({ currentPlayer }) => {
      // Show unsold animation
      setUnsoldPlayerName(currentPlayer);
      setShowUnsoldAnimation(true);
      
      // Add to bid history
      setBidHistory(prev => [{
        player: currentPlayer,
        status: 'unsold',
        time: new Date().toLocaleTimeString()
      }, ...prev].slice(0, 5));

      // Auto hide after 3 seconds
      setTimeout(() => setShowUnsoldAnimation(false), 3000);

      toast.error(`❌ ${currentPlayer} Unsold`, {
        position: "top-center",
        style: {
          background: 'linear-gradient(to right, #ef4444, #dc2626)',
          color: 'white'
        }
      });
    });

    socket.on("timer-update", (data) => {
      setTimer(data.timeLeft);
      // Flash effect when timer is low
      if (data.timeLeft <= 5) {
        setShowBidFlash(true);
        setTimeout(() => setShowBidFlash(false), 1000);
      }
    });
    
    socket.on("bid-updated", (data) => {
      setCurrentBid(data.bid);
      // Flash effect on new bid
      setShowBidFlash(true);
      setTimeout(() => setShowBidFlash(false), 500);
    });

    socket.on("new-player", (data) => {
      setPlayer(data.currentPlayer);
      setTimer(data.timeLeft);
      setCurrentBid(data.currentPlayer.basePrice);
      
      toast.info(`🆕 New Player: ${data.currentPlayer.name}`, {
        position: "top-center",
        style: {
          background: 'linear-gradient(to right, #8b5cf6, #7c3aed)',
          color: 'white'
        }
      });
    });

    socket.on("auction-paused", () => {
      setAuctionPause(true);
      toast.warning("⏸️ Auction Paused - Drinks Break!", {
        position: "top-center",
        style: {
          background: 'linear-gradient(to right, #f97316, #ea580c)',
          color: 'white'
        }
      });
    });
    
    socket.on("auction-ended", () => navigate("/user/auction/ended"));

    return () => {
      socket.off("state-sync");
      socket.off("resume-auction");
      socket.off("timer-update");
      socket.off("bid-updated");
      socket.off("new-player");
      socket.off("auction-paused");
      socket.off("auction-ended");
      socket.off("player-sold");
      socket.off("player-unsold");
    };
  }, []);

  const displayPlayer = player;

  const getStadiumBadge = (status) => {
    const badges = {
      live: {
        bg: "bg-gradient-to-r from-green-600 to-green-400",
        text: "text-white",
        border: "border-green-400",
        glow: "shadow-green-500/50",
        label: "🔴 LIVE NOW"
      },
      paused: {
        bg: "bg-gradient-to-r from-yellow-600 to-yellow-400",
        text: "text-white",
        border: "border-yellow-400",
        glow: "shadow-yellow-500/50",
        label: "⏸ PAUSED"
      }
    };
    return badges[status] || badges.live;
  };

  const badge = getStadiumBadge(isAuctionPaused ? 'paused' : 'live');

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Stadium Background - Exactly like UserAuctions */}
      <div className="fixed inset-0 z-0">
        {/* Main stadium gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-green-900/30 to-slate-900"></div>
        
        {/* Stadium lights effect - moving spotlights */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl"></div>
        </div>

        {/* Stadium seating pattern (crowd silhouette) */}
        <div className="absolute bottom-0 left-0 right-0 h-48">
          {/* Crowd rows */}
          {[...Array(5)].map((_, row) => (
            <div 
              key={row} 
              className="absolute bottom-0 left-0 right-0 flex justify-center gap-1"
              style={{ 
                bottom: `${row * 30}px`,
                opacity: 0.3 - (row * 0.05)
              }}
            >
              {[...Array(30)].map((_, i) => (
                <div 
                  key={i}
                  className="w-2 h-4 bg-yellow-400/20 rounded-t-sm"
                  style={{
                    animation: `crowdMove ${Math.random() * 3 + 2}s ease-in-out infinite`,
                    transform: `translateY(${Math.sin(i) * 2}px)`
                  }}
                ></div>
              ))}
            </div>
          ))}
        </div>

        {/* Stadium arch lights */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-yellow-500/20 to-transparent"></div>
        
        {/* Field grid pattern (like soccer field) */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] border-2 border-green-500/30 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] border-2 border-green-500/20 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[800px] border-2 border-green-500/10 rounded-full"></div>
        </div>
      </div>

      {/* Sold Animation Overlay */}
      {showSoldAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none animate-fadeIn">
          <div className="bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl shadow-2xl p-8 transform animate-bounce-scale border-2 border-white/50">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-wiggle">🏆</div>
              <h2 className="text-4xl font-black text-white mb-2">SOLD!</h2>
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <p className="text-2xl font-bold text-white">{soldPlayerData.name}</p>
                <p className="text-white/90">to {soldPlayerData.bidder}</p>
                <p className="text-3xl font-black text-white mt-2">₹{soldPlayerData.amount}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Unsold Animation Overlay */}
      {showUnsoldAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none animate-fadeIn">
          <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-2xl shadow-2xl p-8 transform animate-bounce-scale border-2 border-white/50">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-wiggle">❌</div>
              <h2 className="text-4xl font-black text-white mb-2">UNSOLD</h2>
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <p className="text-2xl font-bold text-white">{unsoldPlayerName}</p>
                <p className="text-white/90">No bidders</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <NavBar />

      {/* STATUS HEADER with Stadium Style - REDUCED SIZE */}
      <div className="relative z-10 w-full">
        {isAuctionPaused ? (
          <div className="py-1.5 text-xs font-medium text-white bg-gradient-to-r from-yellow-600 to-yellow-400 shadow-lg shadow-yellow-500/50">
            <Marquee speed={60}>
              <span className="mx-4">⏸️</span>
              <span>DRINKS BREAK! Auction will resume shortly...</span>
              <span className="mx-4">🥤</span>
              <span>DRINKS BREAK! Auction will resume shortly...</span>
              <span className="mx-4">⏸️</span>
            </Marquee>
          </div>
        ) : (
          <div className="py-1.5 text-xs font-medium text-white bg-gradient-to-r from-green-600 to-green-400 shadow-lg shadow-green-500/50">
            <Marquee speed={120}>
              <span className="mx-4">🔴</span>
              <span>LIVE AUCTION IN PROGRESS • PLACE YOUR BIDS • LIVE AUCTION IN PROGRESS • PLACE YOUR BIDS</span>
              <span className="mx-4">⚡</span>
            </Marquee>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-6">
        {(displayPlayer && (isAuctionStart || isAuctionPaused)) ? (
          <>
            {/* IMPROVED PLAYER CARD - Cleaner Design */}
            <div className="max-w-4xl mx-auto">
              <div 
                className="group relative transform hover:scale-[1.02] transition-all duration-300"
                style={{
                  animation: `cardAppear 0.5s ease-out both`
                }}
              >
                {/* Clean glass card with subtle border */}
                <div className="relative backdrop-blur-md bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                  
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent"></div>
                  
                  {/* Live indicator - smaller */}
                  {!isAuctionPaused && (
                    <div className="absolute top-3 right-3 z-10">
                      <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full border border-green-500/30">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-[10px] font-medium text-green-400">LIVE</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-col md:flex-row">
                    {/* Player Image Section - Compact */}
                    <div className="md:w-1/3 p-4 flex justify-center items-center">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent rounded-lg"></div>
                        <img
                          src={displayPlayer.imageUrl}
                          alt="player"
                          className="relative rounded-lg object-cover w-40 h-48 md:w-48 md:h-56 shadow-lg border border-white/10"
                        />
                        {/* Jersey number badge - smaller */}
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                          #{displayPlayer.jerseyNo || '00'}
                        </div>
                      </div>
                    </div>

                    {/* Player Details Section - Compact */}
                    <div className="md:w-2/3 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h2 className="text-xl font-bold text-white">
                            {displayPlayer.name}
                          </h2>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-0.5 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-400">
                              {displayPlayer.role}
                            </span>
                            <span className="text-xs text-white/40">•</span>
                            <span className="text-xs text-white/60">{displayPlayer.nationality || 'International'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Stats Grid - Clean cards */}
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="bg-black/30 rounded-lg p-2 border border-white/5">
                          <p className="text-[10px] text-white/40 uppercase">Matches</p>
                          <p className="text-sm font-bold text-white">{displayPlayer.matches}</p>
                        </div>
                        <div className="bg-black/30 rounded-lg p-2 border border-white/5">
                          <p className="text-[10px] text-white/40 uppercase">Runs</p>
                          <p className="text-sm font-bold text-white">{displayPlayer.runs}</p>
                        </div>
                        <div className="bg-black/30 rounded-lg p-2 border border-white/5">
                          <p className="text-[10px] text-white/40 uppercase">Avg</p>
                          <p className="text-sm font-bold text-white">{displayPlayer.average}</p>
                        </div>
                        <div className="bg-black/30 rounded-lg p-2 border border-white/5">
                          <p className="text-[10px] text-white/40 uppercase">SR</p>
                          <p className="text-sm font-bold text-white">{displayPlayer.strikeRate}</p>
                        </div>
                        <div className="bg-black/30 rounded-lg p-2 border border-white/5">
                          <p className="text-[10px] text-white/40 uppercase">100s</p>
                          <p className="text-sm font-bold text-white">{displayPlayer.hundreds}</p>
                        </div>
                        <div className="bg-black/30 rounded-lg p-2 border border-white/5">
                          <p className="text-[10px] text-white/40 uppercase">50s</p>
                          <p className="text-sm font-bold text-white">{displayPlayer.fifties}</p>
                        </div>
                      </div>

                      {/* Additional Stats - Compact */}
                      <div className="flex flex-wrap gap-3 text-xs text-white/60">
                        <span className="flex items-center gap-1">
                          <span className="text-amber-400">📅</span> Innings: {displayPlayer.innings}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="text-amber-400">🏆</span> Highest: {displayPlayer.highestScore}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* TIMER + BID - Smaller Compact Cards */}
              <div className="flex flex-wrap gap-4 mt-6 justify-center">
                {/* Timer Card - Smaller */}
                <div className={`relative group ${showBidFlash ? 'animate-pulse' : ''}`}>
                  <div className="relative backdrop-blur-md bg-white/5 border border-white/10 rounded-lg shadow-lg overflow-hidden p-3 w-32 text-center">
                    <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Time Left</p>
                    <p className={`text-3xl font-bold ${timer <= 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                      {timer}s
                    </p>
                    {timer <= 5 && (
                      <div className="absolute -top-1 -right-1">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Current Bid Card - Smaller */}
                <div className="group relative">
                  <div className="relative backdrop-blur-md bg-white/5 border border-white/10 rounded-lg shadow-lg overflow-hidden p-3 w-32 text-center">
                    <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Current Bid</p>
                    <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-400">
                      ₹{currentBid}
                    </p>
                    {showBidFlash && (
                      <div className="absolute inset-0 bg-amber-500/10 rounded-lg animate-flash"></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bid History - Compact */}
              {bidHistory.length > 0 && (
                <div className="max-w-md mx-auto mt-6">
                  <div className="relative backdrop-blur-md bg-white/5 border border-white/10 rounded-lg shadow-lg overflow-hidden p-3">
                    <h4 className="text-white/60 text-xs font-medium mb-2 flex items-center gap-1">
                      <span>📋</span> Recent Activity
                    </h4>
                    <div className="space-y-1.5">
                      {bidHistory.map((bid, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between text-xs p-2 bg-black/30 rounded border border-white/5 animate-slideIn"
                        >
                          <span className="text-white/80">{bid.player}</span>
                          {bid.status === 'sold' ? (
                            <span className="text-amber-400 font-medium">
                              ₹{bid.amount}
                            </span>
                          ) : (
                            <span className="text-red-400 font-medium">
                              UNSOLD
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          // Welcome Screen - Compact
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="group relative transform hover:scale-[1.02] transition-all duration-300">
              <div className="relative backdrop-blur-md bg-white/5 border border-white/10 rounded-xl shadow-2xl overflow-hidden p-8 text-center">
                <div className="text-6xl mb-4 animate-bounce">🏏</div>
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-400 mb-2">
                  Welcome To The Arena
                </h2>
                <p className="text-sm text-white/60 mb-4">Live Auction Stadium</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-xs text-white/40">Auction will start shortly...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Players Section - Compact Header */}
        <div className="mt-10 max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1 h-6 bg-amber-500 rounded-full"></span>
            <h3 className="text-lg font-bold text-white">NEXT UP</h3>
            <span className="text-xs text-white/40 ml-2">Upcoming Players</span>
          </div>
          <UserUpcomingPlayer auctionId={auctionId} />
        </div>
      </div>

      {/* Add keyframe animations */}
      <style jsx>{`
        @keyframes crowdMove {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes cardAppear {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes bounce-scale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes flash {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-bounce-scale {
          animation: bounce-scale 0.5s ease-in-out;
        }
        
        .animate-wiggle {
          animation: wiggle 0.5s ease-in-out;
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        
        .animate-flash {
          animation: flash 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default UserAuctionScreen;