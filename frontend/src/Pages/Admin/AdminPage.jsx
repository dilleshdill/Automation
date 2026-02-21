import { useEffect, useState } from "react";
import AdminHomeNavBar from "../../Components/AdminComponent/AdminHomeNavBar.jsx";
import axios from "axios";
import AdminAuctionNotStart from "../../Components/AdminComponent/AdminAuctionNotStart.jsx";
import { useNavigate } from "react-router-dom";
import { socket } from "../../Socket/socket.js";
import Loader from "../../Loader/Loader.jsx";
import { toast } from "react-toastify";

const DOMAIN = import.meta.env.VITE_DOMAIN;

const AdminPage = () => {
  const [auctionList, setAuctionList] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showLoader, setLoader] = useState(false);
  const [liveCounts, setLiveCounts] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    fetchList();
  }, []);

  // Update live counts randomly for demo
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCounts(prev => {
        const newCounts = { ...prev };
        Object.keys(newCounts).forEach(key => {
          newCounts[key] = Math.floor(Math.random() * 100 + 20);
        });
        return newCounts;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const fetchList = async () => {
    try {
      const res = await axios.get(`${DOMAIN}/auction/get-auction-list`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setAuctionList(res?.data?.details ?? []);
        
        // Initialize live counts
        const counts = {};
        res?.data?.details?.forEach(a => {
          if (a.status === 'live') {
            counts[a._id] = Math.floor(Math.random() * 100 + 20);
          }
        });
        setLiveCounts(counts);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getNavigate = (id) => {
    navigate(`/auction/${id}`, { state: { id } });
  };

  const startAuction = async (id) => {
    setLoader(true);
    socket.emit("join-auction", id);

    socket.off("auction-started");
    socket.on("auction-started", (auction) => {
      console.log("auction started in adminPage")
      setLoader(false);
      navigate(`/auction/${auction?.auctionId}/live`, {
        state: { auction },
      });
    });

    try {
      await axios.post(
        `${DOMAIN}/auction/start-auction`,
        { auction_id: id },
        { withCredentials: true }
      );
    } catch (err) {
      setLoader(false);
      toast.error(err?.response?.data ?? "Something went wrong");
    }
  };

  const goToTheLiveAuction = (auction, e) => {
    e.stopPropagation();
    navigate(`/auction/${auction?._id}/live`, {
      state: {
        auction: {
          auctionId: auction?._id,
          currentPlayer: auction?.currentPlayer,
        },
      },
    });
  };

  const filteredAuctions = auctionList.filter((item) => {
    const matchesSearch = item?.auction_name
      ?.toLowerCase()
      ?.includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ? true : item?.status === filter;

    return matchesSearch && matchesFilter;
  });

  const statusStyles = {
    upcoming: { bg: "bg-blue-500", text: "text-white", label: "Upcoming", icon: "📅" },
    live: { bg: "bg-green-500", text: "text-white", label: "Live Now", icon: "⚡" },
    paused: { bg: "bg-yellow-500", text: "text-white", label: "Paused", icon: "⏸️" },
    ended: { bg: "bg-gray-500", text: "text-white", label: "Ended", icon: "🏁" }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <AdminHomeNavBar />
      {showLoader && <Loader />}

      {/* Header Section */}
      <div className="relative overflow-hidden">
        {/* Stadium Lights Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-64 h-1 bg-yellow-400/30 blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-1/4 w-64 h-1 bg-blue-400/30 blur-xl animate-pulse delay-300"></div>
        </div>

        {/* Moving Spotlight */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-full bg-gradient-to-r from-yellow-500/5 via-transparent to-transparent -skew-x-12 animate-spotlight-move"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 mb-4">
              ⚡ ADMIN ARENA ⚡
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Manage and control all auction activities from one place
            </p>
            
            {/* Stats */}
            <div className="flex justify-center gap-8 mt-8">
              <div className="text-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-6 py-3">
                <div className="text-3xl font-bold text-white">{auctionList.length}</div>
                <div className="text-yellow-400 text-sm">Total Auctions</div>
              </div>
              <div className="text-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-6 py-3">
                <div className="text-3xl font-bold text-green-400">
                  {auctionList.filter(a => a.status === 'live').length}
                </div>
                <div className="text-green-400 text-sm">Live Now</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {auctionList.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <AdminAuctionNotStart />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          
          {/* Search & Filter */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="text-yellow-400">🏟️</span>
                AUCTION ARENA
              </h2>

              <div className="flex w-full lg:w-auto gap-4">
                <div className="relative flex-1 lg:w-80">
                  <input
                    type="text"
                    placeholder="Search auctions..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 pl-10"
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <svg className="w-5 h-5 text-white/50 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                <select
                  className="w-44 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all" className="bg-slate-800">All</option>
                  <option value="upcoming" className="bg-slate-800">Upcoming</option>
                  <option value="live" className="bg-slate-800">Live</option>
                  <option value="paused" className="bg-slate-800">Paused</option>
                  <option value="ended" className="bg-slate-800">Ended</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-sm text-white/60">
                Showing <span className="font-semibold text-white">{filteredAuctions.length}</span> of{" "}
                <span className="font-semibold text-white">{auctionList.length}</span> auctions
              </p>
            </div>
          </div>

          {/* AUCTION GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredAuctions.map((auction, index) => {
              const status = auction?.status;
              const style = statusStyles[status] || statusStyles.upcoming;
              const isLive = status === 'live';
              const liveCount = liveCounts[auction._id] || 0;
              
              return (
                <div
                  key={auction?._id}
                  onClick={() => getNavigate(auction?._id)}
                  className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-xl hover:shadow-2xl cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-2"
                  style={{
                    animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`
                  }}
                >
                  {/* Image Container */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={auction?.auction_img}
                      alt="auction"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                    
                    {/* Status Badge */}
                    <div className={`absolute top-4 left-4 ${style.bg} px-3 py-1.5 rounded-full text-xs font-semibold ${style.text} flex items-center gap-1.5 shadow-lg`}>
                      <span>{style.icon}</span>
                      <span>{style.label}</span>
                    </div>

                    {/* Live Indicator */}
                    {isLive && (
                      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-green-500/50">
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                          <span className="text-white text-xs font-medium">
                            {liveCount} watching
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Time Badge */}
                    <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20">
                      <span className="text-white/90 text-xs flex items-center gap-1">
                        <span>⏱️</span>
                        {auction?.auction_time}s
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-white mb-2 line-clamp-1">
                      {auction?.auction_name}
                    </h2>

                    <p className="text-white/60 text-sm mb-4 line-clamp-3">
                      {auction?.description}
                    </p>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                        <div className="text-yellow-400 text-xs font-mono mb-1">DATE</div>
                        <div className="text-white text-sm font-bold">{auction?.auction_date}</div>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                        <div className="text-yellow-400 text-xs font-mono mb-1">TIME/ROUND</div>
                        <div className="text-white text-sm font-bold">{auction?.auction_time}s</div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-auto">
                      {status === "upcoming" && (
                        <button
                          className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-500/30"
                          onClick={(e) => {
                            e.stopPropagation();
                            startAuction(auction?._id);
                          }}
                        >
                          🚀 START AUCTION
                        </button>
                      )}

                      {(status === "live" || status === "paused") && (
                        <button
                          className="w-full py-3.5 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-lg hover:from-green-700 hover:to-green-600 transition-all transform hover:scale-[1.02] shadow-lg shadow-green-500/30"
                          onClick={(e) => goToTheLiveAuction(auction, e)}
                        >
                          {status === 'live' ? '🔴 ENTER ARENA' : '⏸️ RESUME AUCTION'}
                        </button>
                      )}

                      {status === "ended" && (
                        <button
                          disabled
                          className="w-full py-3.5 bg-gradient-to-r from-gray-600 to-gray-500 text-white font-bold rounded-lg cursor-not-allowed opacity-60"
                        >
                          🏁 AUCTION ENDED
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Corner Stadium Lights */}
                  <div className="absolute top-0 left-0 w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-transparent"></div>
                  <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-yellow-500/20 to-transparent"></div>
                </div>
              );
            })}
          </div>

          {/* No Results */}
          {filteredAuctions.length === 0 && (
            <div className="text-center py-16 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl">
              <div className="text-white/30 mb-4">
                <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No auctions found</h3>
              <p className="text-white/60 mb-6">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
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

export default AdminPage;