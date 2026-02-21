import React from "react";
import { motion } from "framer-motion";

const BidderSoldPlayer = ({ soldPlayer }) => {
  const soldPlayers = soldPlayer || [];
  console.log(soldPlayers);

  if (soldPlayers.length === 0) {
    return (
      <div className="w-full p-8 flex flex-col items-center justify-center text-center backdrop-blur-md bg-white/20 rounded-2xl border border-white/30">
        <div className="text-6xl mb-4">🏏</div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">No Players Sold Yet</h3>
        <p className="text-slate-600">Players sold in the auction will appear here.</p>
      </div>
    );
  }

  return (
    <div className="w-full p-4">
      {/* Header with stats */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <h2 className="text-lg font-semibold text-slate-800">Sold Players</h2>
          <span className="backdrop-blur-sm bg-white/30 border border-white/40 rounded-full px-3 py-1 text-xs text-slate-700">
            {soldPlayers.length} {soldPlayers.length === 1 ? 'Player' : 'Players'}
          </span>
        </div>
        
        <div className="flex gap-3">
          <div className="backdrop-blur-sm bg-white/30 rounded-lg px-3 py-1.5 border border-white/40">
            <span className="text-xs text-slate-600">Total Spent</span>
            <p className="text-sm font-bold text-green-600">
              ₹{soldPlayers.reduce((sum, p) => sum + (p.soldPrice || 0), 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Players Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {soldPlayers.map((player, index) => (
          <motion.div
            key={player._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group relative backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl shadow-xl hover:shadow-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
          >
            {/* Sold Badge */}
            <div className="absolute top-3 right-3 z-10">
              <div className="backdrop-blur-sm bg-green-500/90 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border border-green-400/50 shadow-lg">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                SOLD
              </div>
            </div>

            {/* Player Number Badge */}
            <div className="absolute top-3 left-3 z-10">
              <div className="backdrop-blur-sm bg-white/30 border border-white/40 rounded-full w-8 h-8 flex items-center justify-center">
                <span className="text-white font-bold text-sm">#{index + 1}</span>
              </div>
            </div>

            {/* Image Container */}
            <div className="relative h-56 overflow-hidden">
              <img
                src={player.imageUrl}
                alt={player.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent"></div>
              
              {/* Price Tag */}
              <div className="absolute bottom-3 right-3 backdrop-blur-md bg-black/40 border border-white/20 rounded-lg px-3 py-1.5">
                <span className="text-green-400 font-bold text-sm">
                  ₹{player.soldPrice?.toLocaleString()}
                </span>
              </div>

              {/* Role Badge */}
              <div className="absolute bottom-3 left-3 backdrop-blur-md bg-white/20 border border-white/30 rounded-lg px-3 py-1.5">
                <span className="text-white text-xs font-medium">{player.role}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 line-clamp-1">
                    {player.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {player.nationality || 'International'} • {player.age || 'N/A'} yrs
                  </p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="backdrop-blur-sm bg-white/30 rounded-lg p-2 border border-white/40">
                  <p className="text-xs text-slate-600">Base Price</p>
                  <p className="text-sm font-semibold text-slate-800">
                    ₹{player.basePrice?.toLocaleString() || 'N/A'}
                  </p>
                </div>
                <div className="backdrop-blur-sm bg-white/30 rounded-lg p-2 border border-white/40">
                  <p className="text-xs text-slate-600">Sold To</p>
                  <p className="text-sm font-semibold text-blue-600 line-clamp-1">
                    {player.soldTo || 'Team'}
                  </p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex flex-wrap gap-2 text-xs">
                {player.specialism && (
                  <span className="backdrop-blur-sm bg-white/30 px-2 py-1 rounded-full border border-white/40 text-slate-600">
                    {player.specialism}
                  </span>
                )}
                {player.captain && (
                  <span className="backdrop-blur-sm bg-yellow-500/30 px-2 py-1 rounded-full border border-yellow-400/40 text-yellow-700">
                    ⭐ Captain
                  </span>
                )}
              </div>

              {/* View Details Button */}
              <button className="w-full mt-4 py-2 backdrop-blur-sm bg-white/30 border border-white/40 rounded-lg text-slate-700 text-sm font-medium hover:bg-white/40 transition-all flex items-center justify-center gap-1 group/btn">
                <span>View Details</span>
                <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Corner Glow */}
            <div className="absolute top-0 left-0 w-12 h-12 bg-gradient-to-br from-green-500/20 to-transparent"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-green-500/20 to-transparent"></div>
          </motion.div>
        ))}
      </div>

      {/* Footer Summary */}
      {soldPlayers.length > 0 && (
        <div className="mt-8 p-4 backdrop-blur-md bg-white/20 border border-white/30 rounded-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/30 flex items-center justify-center">
                <span className="text-green-600">🏆</span>
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Players Sold</p>
                <p className="text-xl font-bold text-slate-800">{soldPlayers.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center">
                <span className="text-blue-600">💰</span>
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Amount</p>
                <p className="text-xl font-bold text-green-600">
                  ₹{soldPlayers.reduce((sum, p) => sum + (p.soldPrice || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/30 flex items-center justify-center">
                <span className="text-purple-600">⭐</span>
              </div>
              <div>
                <p className="text-sm text-slate-600">Average Price</p>
                <p className="text-xl font-bold text-purple-600">
                  ₹{Math.round(soldPlayers.reduce((sum, p) => sum + (p.soldPrice || 0), 0) / soldPlayers.length).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BidderSoldPlayer;