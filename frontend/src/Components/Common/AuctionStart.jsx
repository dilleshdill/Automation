import React from "react";

const AuctionStart = ({ Player }) => {
  const player = Player ?? {};

  // Format currency
  const formatPrice = (price) => {
    if (!price && price !== 0) return "—";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Get role badge style - slate theme
  const getRoleStyle = (role) => {
    const roles = {
      'batsman': 'bg-slate-200 text-slate-700 border-slate-300',
      'bowler': 'bg-slate-200 text-slate-700 border-slate-300',
      'all-rounder': 'bg-slate-200 text-slate-700 border-slate-300',
      'wicket-keeper': 'bg-slate-200 text-slate-700 border-slate-300'
    };
    return roles[role?.toLowerCase()] || 'bg-slate-100 text-slate-600 border-slate-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 via-slate-400 to-slate-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-slate-400 rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-semibold text-white">
              Player Details
            </h2>
          </div>
          <p className="text-slate-400 text-sm mt-1 ml-4">Complete player information and statistics</p>
        </div>

        {/* Main Card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          
          <div className="flex flex-col md:flex-row">
            
            {/* LEFT SIDE - Image and Prices */}
            <div className="md:w-1/3 bg-white/5 p-6 border-r border-white/10">
              <div className="flex flex-col items-center md:items-start gap-6">
                
                {/* Image */}
                <div className="relative w-full flex justify-center">
                  <img
                    src={player?.imageUrl || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80"}
                    alt={player?.name || "Player"}
                    className="w-64 h-64 object-cover rounded-xl shadow-lg border border-white/10"
                  />
                  {player?.jerseyNumber && (
                    <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1">
                      <span className="text-sm font-medium text-white">#{player.jerseyNumber}</span>
                    </div>
                  )}
                </div>

                {/* Player Name (Mobile Only) */}
                <div className="flex md:hidden w-full items-center justify-between">
                  <div className="md:hidden w-full text-center">
                  <h1 className="text-2xl font-bold text-white">
                    {player?.name || "Unknown Player"}
                  </h1>
                  <div className="flex items-center justify-center gap-3 mt-2">
                    {player?.country && (
                      <span className="text-sm text-slate-400">📍 {player.country}</span>
                    )}
                    {player?.role && (
                      <span className={`text-xs px-3 py-1 rounded-full border ${getRoleStyle(player?.role)}`}>
                        {player?.role}
                      </span>
                    )}
                  </div>
                  
                  </div>
                  <div className="block md:hidden">
                    {/* Status Indicator */}
                    {player?.status && (
                      <div className="w-full flex justify-center md:justify-start">
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full">
                          <span className={`w-2 h-2 rounded-full ${
                            player.status === 'live' ? 'bg-green-400 animate-pulse' : 'bg-slate-400'
                          }`}></span>
                          <span className="text-xs font-medium text-white/80 uppercase">
                            {player.status}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Price Cards - Stacked Vertically */}
                <div className="w-full space-y-3 md:space-y-0 md:gap-2 mt-2 md:flex md:items-center md:justify-between">
                  <div className="bg-white/5 w-full backdrop-blur-sm border border-white/10 rounded-xl p-4">
                    <p className="text-xs text-slate-400 mb-1">Base Price</p>
                    <p className="text-xl font-semibold text-white">{formatPrice(player?.basePrice)}</p>
                  </div>
                  <div className="bg-white/5 w-full backdrop-blur-sm border border-white/10 rounded-xl p-4">
                    <p className="text-xs text-emerald-400 mb-1">Sold Price</p>
                    <p className="text-xl font-semibold text-emerald-400">{formatPrice(player?.soldPrice)}</p>
                  </div>
                </div>

                
              </div>
            </div>

            {/* RIGHT SIDE - All Stats */}
            <div className="md:w-2/3 p-6">
              
              <div className="flex justify-between w-full">
                {/* Name and Role (Desktop Only) */}
                <div className="hidden md:block mb-6">
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    {player?.name || "Unknown Player"}
                  </h1>
                  <div className="flex items-center gap-3 mt-2">
                    {player?.country && (
                      <span className="text-sm text-slate-400">📍 {player.country}</span>
                    )}
                    {player?.role && (
                      <span className={`text-xs px-3 py-1 rounded-full border ${getRoleStyle(player?.role)}`}>
                        {player?.role}
                      </span>
                    )}
                  </div>
                </div>

                <div className="hidden md:block">
                  {/* Status Indicator */}
                  {player?.status && (
                    <div className="w-full flex justify-center md:justify-start">
                      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full">
                        <span className={`w-2 h-2 rounded-full ${
                          player.status === 'live' ? 'bg-green-400 animate-pulse' : 'bg-slate-400'
                        }`}></span>
                        <span className="text-xs font-medium text-white/80 uppercase">
                          {player.status}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="space-y-6">
                
                {/* Batting Statistics */}
                <div>
                  <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">Batting Statistics</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <StatBox label="Matches" value={player?.stats?.matches} />
                    <StatBox label="Innings" value={player?.stats?.innings} />
                    <StatBox label="Runs" value={player?.stats?.runs} />
                    <StatBox label="Highest" value={player?.stats?.highestScore} />
                    <StatBox label="Average" value={player?.stats?.average} />
                    <StatBox label="Strike Rate" value={player?.stats?.strikeRate} />
                  </div>
                </div>

                {/* Bowling Statistics (if available) */}
                {player?.stats?.wickets && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">Bowling Statistics</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <StatBox label="Wickets" value={player?.stats?.wickets} />
                      <StatBox label="Economy" value={player?.stats?.economy} />
                      <StatBox label="Average" value={player?.stats?.bowlingAvg} />
                    </div>
                  </div>
                )}

                {/* Fielding Statistics (if available) */}
                {player?.stats?.catches && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">Fielding Statistics</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <StatBox label="Catches" value={player?.stats?.catches} />
                      <StatBox label="Run Outs" value={player?.stats?.runOuts} />
                      <StatBox label="Stumpings" value={player?.stats?.stumpings} />
                    </div>
                  </div>
                )}

                {/* Centuries & Fifties */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                    <p className="text-xs text-slate-400 mb-1">Hundreds</p>
                    <p className="text-lg font-semibold text-amber-400">{player?.stats?.hundreds || 0}</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                    <p className="text-xs text-slate-400 mb-1">Fifties</p>
                    <p className="text-lg font-semibold text-blue-400">{player?.stats?.fifties || 0}</p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              {player?.additionalInfo && (
                <div className="mt-6 pt-4 border-t border-white/10">
                  <p className="text-sm text-slate-400">{player.additionalInfo}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Stat Box Component - Slate Theme
const StatBox = ({ label, value }) => (
  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3">
    <p className="text-xs text-slate-400 mb-1">{label}</p>
    <p className="text-sm font-semibold text-white">
      {value !== undefined && value !== null && value !== "" ? value : "—"}
    </p>
  </div>
);

export default AuctionStart;