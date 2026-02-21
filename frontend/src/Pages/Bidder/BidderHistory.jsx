import React, { useEffect, useState, useMemo } from "react";
import BidderHomeNavBar from "../../Components/BidderComponent/BidderHomeNavBar.jsx";
import axios from "axios";
import BidderAuctionNotStart from "../../Components/BidderComponent/BidderAuctionNotStart.jsx";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const DOMAIN = import.meta.env.VITE_DOMAIN;

const BidderHistory = () => {
  const [auctionList, setAuctionList] = useState([]);
  const [loginId, setLoginId] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      const res = await axios.get(`${DOMAIN}/auction/get-auction-list`, {
        withCredentials: true,
      });
      if (res.status === 200) setAuctionList(res?.data?.details ?? []);
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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${DOMAIN}/bidder/checkAuth`, {
          withCredentials: true,
        });

        if (res.status === 200) {
          console.log(res.data);
          const email = res?.data?.data?.email;

          const loggedAuctions = auctionList
            .filter((a) => a?.franchises?.some((f) => f?.email === email))
            .map((a) => a._id);

          setLoginId(loggedAuctions);
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (auctionList.length > 0) checkAuth();
  }, [auctionList]);

  const filteredAuctions = useMemo(() => {
    return auctionList.filter((a) => {
      const matchSearch = a?.auction_name?.toLowerCase()?.includes(search.toLowerCase());
      const matchFilter = filterStatus === "all" || a?.status === filterStatus;
      return matchSearch && matchFilter;
    });
  }, [auctionList, search, filterStatus]);

  const getNavigate = (id) => {
    navigate(`/bidder/auctiondetailes/${id}`, { state: { id } });
  };

  const statusStyles = {
    upcoming: { 
      bg: "bg-blue-500/20 text-blue-400 border-blue-500/30", 
      label: "Upcoming", 
      icon: "📅"
    },
    live: { 
      bg: "bg-green-500/20 text-green-400 border-green-500/30", 
      label: "Live Now", 
      icon: "⚡"
    },
    paused: { 
      bg: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", 
      label: "Paused", 
      icon: "⏸️"
    },
    ended: { 
      bg: "bg-gray-500/20 text-gray-400 border-gray-500/30", 
      label: "Ended", 
      icon: "🏁"
    }
  };

  // Calculate stats
  const totalAuctions = loginId.length;
  const liveAuctions = auctionList.filter(a => loginId.includes(a._id) && a.status === 'live').length;
  const endedAuctions = auctionList.filter(a => loginId.includes(a._id) && a.status === 'ended').length;

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col bg-gradient-to-r from-slate-600 via-slate-200 to-slate-600">
        <BidderHomeNavBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-white/30 border-t-slate-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const userAuctions = auctionList.filter(a => loginId.includes(a._id));

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-r from-slate-600 via-slate-200 to-slate-600">
      <BidderHomeNavBar />

      {/* Header Section */}
      <div className="relative overflow-hidden">
        {/* Moving Spotlights */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-64 h-1 bg-yellow-400/30 blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-1/4 w-64 h-1 bg-blue-400/30 blur-xl animate-pulse delay-300"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 mb-2">
              📜 AUCTION HISTORY
            </h1>
            <p className="text-white/60 text-sm max-w-2xl mx-auto">
              Track all your participated auctions and their status
            </p>
          </div>
        </div>
      </div>

      {userAuctions.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <BidderAuctionNotStart />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-xs mb-1">Total Auctions</p>
                  <p className="text-2xl font-bold text-white">{totalAuctions}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center">
                  <span className="text-xl">📊</span>
                </div>
              </div>
            </div>
            
            <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-xs mb-1">Live Now</p>
                  <p className="text-2xl font-bold text-green-400">{liveAuctions}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-500/30 flex items-center justify-center">
                  <span className="text-xl">⚡</span>
                </div>
              </div>
            </div>
            
            <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-xs mb-1">Completed</p>
                  <p className="text-2xl font-bold text-gray-400">{endedAuctions}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-500/30 flex items-center justify-center">
                  <span className="text-xl">🏁</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search + Filter */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <input
                  placeholder="Search auctions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                />
                <svg className="w-4 h-4 text-white/50 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full sm:w-44 px-4 py-2.5 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              >
                <option value="all" className="bg-slate-800">All Status</option>
                <option value="upcoming" className="bg-slate-800">Upcoming</option>
                <option value="live" className="bg-slate-800">Live</option>
                <option value="paused" className="bg-slate-800">Paused</option>
                <option value="ended" className="bg-slate-800">Ended</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="mt-3 pt-3 border-t border-white/20">
              <p className="text-xs text-white/60">
                Showing <span className="font-semibold text-white">{filteredAuctions.filter(a => loginId.includes(a._id)).length}</span> of{" "}
                <span className="font-semibold text-white">{userAuctions.length}</span> auctions
              </p>
            </div>
          </div>

          {/* Auctions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAuctions.map((auction, index) => 
              loginId.includes(auction?._id) && (
                <motion.div
                  key={auction?._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  onClick={() => getNavigate(auction?._id)}
                  className="group relative backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl shadow-xl hover:shadow-2xl cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Stadium Light Scan Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>

                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={auction?.auction_img}
                      alt={auction?.auction_name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>

                    {/* Status Badge */}
                    <div className={`absolute top-3 left-3 backdrop-blur-md ${statusStyles[auction?.status]?.bg} border ${statusStyles[auction?.status]?.border} px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg`}>
                      <span>{statusStyles[auction?.status]?.icon}</span>
                      <span>{statusStyles[auction?.status]?.label}</span>
                    </div>

                    {/* Date Badge */}
                    <div className="absolute bottom-3 right-3 backdrop-blur-md bg-black/30 border border-white/20 px-3 py-1.5 rounded-lg">
                      <span className="text-white/90 text-xs flex items-center gap-1">
                        <span>📅</span>
                        {auction?.auction_date}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
                      {auction?.auction_name}
                    </h3>

                    <p className="text-white/60 text-sm mb-4 line-clamp-2">
                      {auction?.description}
                    </p>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-2">
                        <p className="text-yellow-400/80 text-xs font-mono mb-0.5">TIME</p>
                        <p className="text-white text-sm font-bold">{auction?.auction_time}s</p>
                      </div>
                      <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-2">
                        <p className="text-yellow-400/80 text-xs font-mono mb-0.5">STATUS</p>
                        <p className="text-white text-sm font-bold capitalize">{auction?.status}</p>
                      </div>
                    </div>

                    {/* Action Button */}
                    {auction.status === "ended" && (
                      <button className="w-full py-2.5 backdrop-blur-sm bg-gray-500/30 border border-gray-500/30 text-gray-300 text-sm font-medium rounded-lg cursor-not-allowed flex items-center justify-center gap-2">
                        <span>🏁</span>
                        Auction Ended
                      </button>
                    )}
                  </div>

                  {/* Corner Glow */}
                  <div className="absolute top-0 left-0 w-12 h-12 bg-gradient-to-br from-yellow-500/10 to-transparent"></div>
                  <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-yellow-500/10 to-transparent"></div>
                </motion.div>
              )
            )}
          </div>

          {/* No Results */}
          {filteredAuctions.filter(a => loginId.includes(a._id)).length === 0 && (
            <div className="text-center py-12 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl">
              <div className="text-white/30 mb-4">
                <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No auctions found</h3>
              <p className="text-white/60 mb-6">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => {
                  setSearch("");
                  setFilterStatus("all");
                }}
                className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900 font-medium rounded-lg hover:from-yellow-500 hover:to-orange-500 transition-all"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BidderHistory;