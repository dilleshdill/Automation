import { React, useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import UserHomeNavBar from '../../Components/User/UserHomeNavBar.jsx';
import { useNavigate } from 'react-router-dom';
import BidderAuctionNotStart from '../../Components/BidderComponent/BidderAuctionNotStart.jsx';
import Loader from '../../Loader/Loader.jsx';

const DOMAIN = import.meta.env.VITE_DOMAIN;

const UserAuctions = () => {
  const [auctionList, setAuctionList] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      const response = await axios.get(DOMAIN + "/user/get-auction-list", { withCredentials: true });
      if (response.status === 200) {
        setAuctionList(response.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
    const interval = setInterval(fetchList, 5000);
    return () => clearInterval(interval);
  }, []);

  const getNavigate = (id) => {
    navigate(`/user/auction/${id}`, { state: { id } });
  };

  const getLiveAuction = (id, e) => {
    e.stopPropagation();
    const userId = localStorage.getItem("userId");
    navigate(`/user/auctions/${id}/live`, {
      state: { data: { id, userId } }
    });
  };

  const filteredAuctions = useMemo(() => {
    return auctionList?.filter((a) => {
      const matchSearch = a?.auction_name?.toLowerCase()?.includes(search.toLowerCase());
      const matchFilter = filterStatus === "all" || a?.status === filterStatus;
      return matchSearch && matchFilter;
    });
  }, [auctionList, search, filterStatus]);

  const getStadiumBadge = (status) => {
    const badges = {
      upcoming: {
        bg: "bg-gradient-to-r from-blue-600 to-blue-400",
        text: "text-white",
        border: "border-blue-400",
        glow: "shadow-blue-500/50",
        label: "🔜 UPCOMING"
      },
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
      },
      ended: {
        bg: "bg-gradient-to-r from-gray-600 to-gray-400",
        text: "text-white",
        border: "border-gray-400",
        glow: "shadow-gray-500/50",
        label: "🏁 ENDED"
      },
    };
    return badges[status] || badges.upcoming;
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className='flex flex-col min-h-screen relative overflow-x-hidden'>
      {/* Stadium Background */}
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

      {/* Content with higher z-index */}
      <div className="relative z-10">
        <UserHomeNavBar />

        {/* Search + Filter with stadium glass effect */}
        <div className="max-w-7xl mx-auto w-full px-6 mt-6">
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-4 shadow-2xl">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <input
                placeholder="🔍 Search Auction..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-0 bg-white/20 backdrop-blur-sm text-white placeholder-white/70 px-4 py-2 rounded-md w-full sm:w-[250px] shadow-lg outline-none focus:ring-2 focus:ring-yellow-400/50"
              />

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border-0 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-md shadow-lg cursor-pointer outline-none focus:ring-2 focus:ring-yellow-400/50"
              >
                <option value="all" className="bg-slate-800">🎯 All Auctions</option>
                <option value="upcoming" className="bg-slate-800">🔜 Upcoming</option>
                <option value="live" className="bg-slate-800">🔴 Live</option>
                <option value="paused" className="bg-slate-800">⏸ Paused</option>
                <option value="ended" className="bg-slate-800">🏁 Ended</option>
              </select>
            </div>
          </div>
        </div>

        {filteredAuctions?.length === 0 ? (
          <div className='flex flex-1 justify-center items-center relative z-10'>
            <BidderAuctionNotStart />
          </div>
        ) : (
          <div className='px-6 py-10 max-w-7xl mx-auto w-full space-y-4 relative z-10'>
            <h1 className="text-[32px] font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 tracking-tight animate-pulse">
              ⚡ LIVE AUCTIONS ARENA ⚡
            </h1>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7'>
              {filteredAuctions.map((auction, index) => {
                const badge = getStadiumBadge(auction.status);
                const isLive = auction.status === "live";
                
                return (
                  <div
                    key={auction._id}
                    onClick={() => getNavigate(auction._id)}
                    className="group relative transform hover:scale-105 transition-all duration-300 cursor-pointer"
                    style={{
                      animation: `cardAppear 0.5s ease-out ${index * 0.1}s both`
                    }}
                  >
                    {/* Stadium card with glass morphism */}
                    <div className="relative backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl shadow-2xl overflow-hidden hover:shadow-yellow-400/20">
                      
                      {/* Live indicator for live auctions */}
                      {isLive && (
                        <div className="absolute top-4 right-4 z-20">
                          <div className="relative">
                            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping"></div>
                            <div className="relative w-3 h-3 bg-red-500 rounded-full"></div>
                          </div>
                        </div>
                      )}

                      {/* Stadium spotlight effect on hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-yellow-400/20 via-transparent to-transparent"></div>

                      {/* Image with stadium overlay */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          src={auction.auction_img}
                          alt="auctionImage"
                        />
                        {/* Stadium light scan effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        
                        {/* Stadium scoreboard style status */}
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge.bg} ${badge.text} border ${badge.border} shadow-lg ${badge.glow} backdrop-blur-sm`}>
                            {badge.label}
                          </span>
                        </div>

                        {/* Stadium timer effect */}
                        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                          <span className="text-yellow-400 text-xs font-mono">
                            ⏱ {auction.auction_time}s
                          </span>
                        </div>
                      </div>

                      {/* Content with stadium typography */}
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-2">
                          <h2 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                            {auction.auction_name}
                          </h2>
                          <span className="text-2xl filter drop-shadow-lg">
                            {isLive ? '🎯' : '⚡'}
                          </span>
                        </div>

                        <p className="text-sm text-white/70 mb-4 line-clamp-2 font-light">
                          {auction.description}
                        </p>

                        {/* Stadium info board */}
                        <div className="space-y-2 mb-4 p-3 bg-black/30 rounded-lg border border-white/10">
                          <div className="flex items-center text-xs text-white/60">
                            <span className="w-6">📅</span>
                            <span className="font-mono">{auction.auction_date}</span>
                          </div>
                          <div className="flex items-center text-xs text-white/60">
                            <span className="w-6">⏳</span>
                            <span className="font-mono">Player Time: {auction.auction_time}s</span>
                          </div>
                          {isLive && (
                            <div className="flex items-center text-xs text-green-400 animate-pulse">
                              <span className="w-6">👥</span>
                              <span className="font-mono">{Math.floor(Math.random() * 50 + 20)} bidders watching</span>
                            </div>
                          )}
                        </div>

                        {/* Stadium action button */}
                        <button
                          onClick={(e) => getLiveAuction(auction._id, e)}
                          className={`w-full py-3 rounded-lg font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group/btn ${
                            auction.status === "live" 
                              ? "bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/50"
                              : auction.status === "upcoming"
                              ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/50"
                              : auction.status === "paused"
                              ? "bg-gradient-to-r from-yellow-600 to-yellow-500 text-white shadow-lg shadow-yellow-500/50"
                              : "bg-gradient-to-r from-gray-600 to-gray-500 text-white shadow-lg shadow-gray-500/50"
                          }`}
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            {auction.status === "live" && "🔴 ENTER ARENA"}
                            {auction.status === "upcoming" && "🔜 PREVIEW"}
                            {auction.status === "paused" && "⏸ PAUSED"}
                            {auction.status === "ended" && "🏁 VIEW RESULTS"}
                          </span>
                          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                        </button>
                      </div>

                      {/* Stadium border glow */}
                      <div className="absolute inset-0 border-2 border-transparent group-hover:border-yellow-400/50 rounded-2xl transition-colors duration-300 pointer-events-none"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAuctions;