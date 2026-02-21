import { React, useEffect, useState } from 'react';
import axios from "axios";
import { useLocation } from "react-router-dom";
import BidderHomeNavBar from "../../Components/BidderComponent/BidderHomeNavBar";

const DOMAIN = import.meta.env.VITE_DOMAIN;

const UserAuctionDetails = () => {
  const [auction, setAuction] = useState({});
  const location = useLocation();
  const { id } = location.state || {};

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const res = await axios.post(
          `${DOMAIN}/auction/get-auction`,
          { auction_id: id },
          { withCredentials: true }
        );
        if (res.status === 200) {
          setAuction(res.data.existingAuction);
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (id) fetchAuction();
  }, [id]);

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

  const badge = getStadiumBadge(auction?.status);
  const isLive = auction?.status === "live";

  return (
    <>
      <BidderHomeNavBar />

      <div className="min-h-screen relative overflow-x-hidden">
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
        <div className="relative z-10 px-6 py-10 flex justify-center">
          <div 
            className="max-w-6xl w-full transform hover:scale-[1.02] transition-all duration-300"
            style={{
              animation: `cardAppear 0.5s ease-out both`
            }}
          >
            {/* Stadium card with glass morphism */}
            <div className="relative backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl shadow-2xl overflow-hidden hover:shadow-yellow-400/20 p-8">
              
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

              {/* Stadium light scan effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>

              {/* HEADER + STATUS */}
              <div className="flex flex-col md:flex-row items-start justify-between gap-3 relative z-10">
                <h1 className="text-[32px] font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 tracking-tight">
                  {auction?.auction_name || "AUCTION DETAILS"}
                </h1>

                {auction?.status && (
                  <span className={`px-4 py-[4px] rounded-full text-sm font-bold ${badge.bg} ${badge.text} border ${badge.border} shadow-lg ${badge.glow} backdrop-blur-sm`}>
                    {badge.label}
                  </span>
                )}
              </div>

              {/* GRID CONTENT */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10 relative z-10">

                {/* AUCTION IMAGE with stadium frame */}
                <div className="flex justify-center">
                  <div className="relative group/image">
                    <img
                      src={auction?.auction_img}
                      alt={auction?.auction_name}
                      className="w-72 h-80 object-cover rounded-xl shadow-2xl border-2 border-white/20 group-hover/image:scale-105 transition-transform duration-500"
                    />
                    {/* Stadium light scan effect on image */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/image:translate-x-full transition-transform duration-1000 rounded-xl"></div>
                    
                    {/* Timer badge */}
                    <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                      <span className="text-yellow-400 text-xs font-mono">
                        ⏱ {auction?.auction_time || 0}s
                      </span>
                    </div>
                  </div>
                </div>

                {/* INFO with stadium info board style */}
                <div className="lg:col-span-2 space-y-5">
                  <div className="p-5 bg-black/30 rounded-lg border border-white/10 space-y-4">
                    <Detail label="Player Time" value={`${auction?.auction_time || "-"}s`} />
                    <Detail label="Short Name" value={auction?.shorts} />
                    <Detail label="Status" value={auction?.status} />
                  </div>

                  <div className="p-5 bg-black/30 rounded-lg border border-white/10">
                    <p className="text-xs uppercase font-semibold text-yellow-400 tracking-wider flex items-center gap-2">
                      <span>📋</span> Description
                    </p>
                    <p className="text-[14px] text-white/70 leading-relaxed mt-2 font-light">
                      {auction?.description || "No description provided."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stadium border glow */}
              <div className="absolute inset-0 border-2 border-transparent hover:border-yellow-400/50 rounded-2xl transition-colors duration-300 pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Add keyframe animations */}
      <style jsx>{`
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
        
        @keyframes crowdMove {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </>
  );
};

const Detail = ({ label, value }) => (
  <div className="flex items-center justify-between border-b border-white/10 pb-2 last:border-0">
    <p className="text-xs uppercase font-semibold text-white/60 tracking-wider flex items-center gap-2">
      <span className="text-yellow-400">▶</span> {label}
    </p>
    <p className="text-[15px] font-medium text-white group-hover:text-yellow-400 transition-colors">
      {value || "-"}
    </p>
  </div>
);

export default UserAuctionDetails;