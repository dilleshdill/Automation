import { React, useEffect, useState } from "react";
import { socket } from "../../Socket/socket";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import BidderNavBar from "../../Components/BidderComponent/BidderNavBar";
import Marquee from "react-fast-marquee";
import axios from "axios";
import BidderUpcomingPlayer from "../../Components/BidderComponent/BidderUpcomingPlayer";
import BidderSoldPlayer from "./BidderSoldPlayer";

const DOMAIN = import.meta.env.VITE_DOMAIN;

const BidderAuctionScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { data } = location.state || {};
  const { id, teamName, teamId} = data ?? {};

  const auctionId = id;
  localStorage.setItem("auctionId", auctionId);

  const [player, setPlayer] = useState(null);
  const [isAuctionStart, setAuctionStart] = useState(false);

  const [currentBid, setCurrentBid] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isAuctionPaused, setAuctionPause] = useState(false);
  const [purse, setPurse] = useState(0);
  const [soldPlayer, setSoldPlayer] = useState([]);
  const [showBidFlash, setShowBidFlash] = useState(false);
  const [bidHistory, setBidHistory] = useState([]);
  const [showSoldAnimation, setShowSoldAnimation] = useState(false);
  const [soldPlayerData, setSoldPlayerData] = useState({ name: "", bidder: "", amount: 0 });
  const [showUnsoldAnimation, setShowUnsoldAnimation] = useState(false);
  const [unsoldPlayerName, setUnsoldPlayerName] = useState("");

  const fetchedData = async () => {
    try {
      const response = await axios.get(
        `${DOMAIN}/auction/auction-status?auctionId=${auctionId}`,{
          withCredentials:true
        }
      );

      if (response.status === 200) {
        if (response.data.status === "live") {
          setAuctionPause(false);
          setAuctionStart(true);
        }
        if (response.data.status === "paused") {
          setAuctionPause(true);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getPurse = async() => {
    try{
      const response = await axios.get(`${DOMAIN}/bidder/getPurse?auctionId=${auctionId}`,
        {
        withCredentials:true
      })
      if(response.status === 200){
        console.log(response.data.data[0] )
        setPurse(response.data.data[0].purse)
        setSoldPlayer(response.data.data[0].players)
      }
    }catch(err){
      console.log(err)
    }
  }

  useEffect(() => {
    fetchedData();
    getPurse()

    socket.emit("franchise-join", {
      id,
      teamName,
    });

    socket.on(
      "state-sync",
      ({ currentPlayer, currentBid, currentBidder, timeLeft, auctionStatus }) => {
        setPlayer(currentPlayer);
        setCurrentBid(currentBid);
        setTimer(timeLeft);
      }
    );

    socket.on("resume-auction", () => {
      setAuctionPause(false);
      setAuctionStart(true);
      toast.success("🎉 Auction Resumed!", {
        style: {
          background: 'linear-gradient(to right, #10b981, #059669)',
          color: 'white'
        }
      });
    });

    socket.on("auction-started", (auction) => {
      setPlayer(auction.currentPlayer);
      setAuctionStart(true);
      toast.success("🏏 Auction Started!", {
        style: {
          background: 'linear-gradient(to right, #3b82f6, #2563eb)',
          color: 'white'
        }
      });
    });

    if (auctionId) {
      socket.emit("join-auction", auctionId);
    }

    socket.on("timer-update", (data) => {
      setTimer(data.timeLeft);
      if (data.timeLeft <= 5) {
        setShowBidFlash(true);
        setTimeout(() => setShowBidFlash(false), 1000);
      }
    });
    
    socket.on("bid-updated", (data) => {
      setCurrentBid(data.bid);
      setShowBidFlash(true);
      setTimeout(() => setShowBidFlash(false), 500);
    });

    socket.on("new-player", (data) => {
      setPlayer(data.currentPlayer);
      setTimer(data.timeLeft);
      setCurrentBid(data.currentPlayer.basePrice);
      toast.info(`🆕 New Player: ${data.currentPlayer.name}`, {
        style: {
          background: 'linear-gradient(to right, #8b5cf6, #7c3aed)',
          color: 'white'
        }
      });
    });

    socket.on("join-error", (msg) => {
      toast.error(msg);
      navigate("/bidder/auctions");
    });

    socket.on("join-success", (msg) => {
      localStorage.setItem("BidderId", teamId);
      toast.success("Welcome To The Auction", {
        style: {
          background: 'linear-gradient(to right, #10b981, #059669)',
          color: 'white'
        }
      });
    });

    socket.on("player-sold", ({ currentBidder, currentPlayer, amount }) => {
      getPurse();
      setSoldPlayerData({ 
        name: currentPlayer, 
        bidder: currentBidder,
        amount: amount || currentBid 
      });
      setShowSoldAnimation(true);
      
      setBidHistory(prev => [{
        player: currentPlayer,
        bidder: currentBidder,
        amount: amount || currentBid,
        status: 'sold',
        time: new Date().toLocaleTimeString()
      }, ...prev].slice(0, 5));

      setTimeout(() => setShowSoldAnimation(false), 3000);

      toast.success(`🎯 SOLD! ${currentPlayer} to ${currentBidder} for ₹${amount || currentBid}`, {
        style: {
          background: 'linear-gradient(to right, #f59e0b, #d97706)',
          color: 'white'
        }
      });
    });

    socket.on("player-unsold", ({ currentPlayer }) => {
      setUnsoldPlayerName(currentPlayer);
      setShowUnsoldAnimation(true);
      
      setBidHistory(prev => [{
        player: currentPlayer,
        status: 'unsold',
        time: new Date().toLocaleTimeString()
      }, ...prev].slice(0, 5));

      setTimeout(() => setShowUnsoldAnimation(false), 3000);

      toast.error(`❌ ${currentPlayer} Unsold`, {
        style: {
          background: 'linear-gradient(to right, #ef4444, #dc2626)',
          color: 'white'
        }
      });
    });

    socket.on("bid-error", (msg) => {
      toast.error(msg);
    });

    socket.on("auction-paused", () => {
      setAuctionPause(true);
      toast.warning("⏸️ Auction Paused - Drinks Break!", {
        style: {
          background: 'linear-gradient(to right, #f97316, #ea580c)',
          color: 'white'
        }
      });
    });

    socket.on("auction-ended", () => {
      navigate("/bidder/auction/ended");
    });

    return () => {
      socket.off("timer-update");
      socket.off("bid-updated");
      socket.off("new-player");
      socket.off("franchise-join");
      socket.off("join-error");
      socket.off("auction-started");
      socket.off("state-sync");
      socket.off("player-sold");
      socket.off("player-unsold");
    };
  }, []);

  const placeBid = () => {
    socket.emit("place-bid", {
      auctionId,
      bid: currentBid + 25000,
      teamName,
      teamId,
    });
  };

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
      {/* Stadium Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-green-900/30 to-slate-900"></div>
        
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-48">
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

        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-yellow-500/20 to-transparent"></div>
        
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] border-2 border-green-500/30 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] border-2 border-green-500/20 rounded-full"></div>
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

      <BidderNavBar />

      {/* STATUS HEADER */}
      <div className="relative z-10 w-full">
        {isAuctionPaused ? (
          <div className="py-1.5 text-xs font-medium text-white bg-gradient-to-r from-yellow-600 to-yellow-400 shadow-lg shadow-yellow-500/50">
            <Marquee speed={60}>
              <span className="mx-4">⏸️</span>
              <span>AUCTION PAUSED • DRINKS BREAK • AUCTION PAUSED • DRINKS BREAK</span>
              <span className="mx-4">🥤</span>
            </Marquee>
          </div>
        ) : (
          <div className="py-1.5 text-xs font-medium text-white bg-gradient-to-r from-green-600 to-green-400 shadow-lg shadow-green-500/50">
            <Marquee speed={120}>
              <span className="mx-4">🔴</span>
              <span>LIVE AUCTION • PLACE YOUR BIDS • LIVE AUCTION • PLACE YOUR BIDS</span>
              <span className="mx-4">⚡</span>
            </Marquee>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-6">
        {displayPlayer && (isAuctionPaused || isAuctionStart) ? (
          <>
            {/* PLAYER CARD - Clean Stadium Style */}
            <div className="max-w-4xl mx-auto">
              <div 
                className="group relative transform hover:scale-[1.02] transition-all duration-300"
                style={{
                  animation: `cardAppear 0.5s ease-out both`
                }}
              >
                <div className="relative backdrop-blur-md bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                  
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent"></div>
                  
                  {/* Live indicator */}
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
                    {/* Player Image Section */}
                    <div className="md:w-1/3 p-4 flex justify-center items-center">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent rounded-lg"></div>
                        <img
                          src={displayPlayer.imageUrl}
                          alt="player"
                          className="relative rounded-lg object-cover w-40 h-48 md:w-48 md:h-56 shadow-lg border border-white/10"
                        />
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                          #{displayPlayer.jerseyNo || '00'}
                        </div>
                      </div>
                    </div>

                    {/* Player Details Section */}
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
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${badge.bg} ${badge.text} border ${badge.border} shadow-lg ${badge.glow}`}>
                          {badge.label}
                        </span>
                      </div>

                      {/* Stats Grid */}
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

                      {/* Additional Stats */}
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

              {/* BIDDING UI - Compact Cards */}
              <div className="flex flex-wrap gap-4 mt-6 justify-center">
                {/* Timer Card */}
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

                {/* Current Bid Card */}
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

                {/* Purse Card */}
                <div className="group relative">
                  <div className="relative backdrop-blur-md bg-white/5 border border-white/10 rounded-lg shadow-lg overflow-hidden p-3 w-32 text-center">
                    <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Purse Left</p>
                    <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                      ₹{purse}
                    </p>
                  </div>
                </div>
              </div>

              {/* Place Bid Button */}
              {!isAuctionPaused && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={placeBid}
                    className="group relative px-8 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold rounded-lg shadow-lg shadow-amber-500/50 hover:shadow-xl hover:shadow-amber-500/60 transform hover:scale-105 transition-all duration-300 overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                    <span className="relative z-10 flex items-center gap-2">
                      <span>⚡</span>
                      <span>PLACE BID (₹{currentBid + 25000})</span>
                      <span>⚡</span>
                    </span>
                  </button>
                </div>
              )}

              {/* Bid History */}
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

              {/* Upcoming Players */}
              <div className="mt-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1 h-6 bg-amber-500 rounded-full"></span>
                  <h3 className="text-lg font-bold text-white">NEXT UP</h3>
                  <span className="text-xs text-white/40 ml-2">Upcoming Players</span>
                </div>
                <BidderUpcomingPlayer auctionId={auctionId} />
              </div>

              {/* Sold Players */}
              <div className="mt-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                  <h3 className="text-lg font-bold text-white">SOLD PLAYERS</h3>
                  <span className="text-xs text-white/40 ml-2">{soldPlayer.length} players</span>
                </div>
                <BidderSoldPlayer soldPlayer={soldPlayer} />
              </div>
            </div>
          </>
        ) : (
          // Welcome Screen
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="group relative transform hover:scale-[1.02] transition-all duration-300">
              <div className="relative backdrop-blur-md bg-white/5 border border-white/10 rounded-xl shadow-2xl overflow-hidden p-8 text-center">
                <div className="text-6xl mb-4 animate-bounce">🏏</div>
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-400 mb-2">
                  Welcome {teamName}!
                </h2>
                <p className="text-sm text-white/60 mb-4">Prepare Your Bids</p>
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

export default BidderAuctionScreen;