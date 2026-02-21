import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../../Components/Common/NavBar";

const UserTeamPlayers = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const Players = location.state || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const handleNavigate = (id, setNo) => {
    navigate(`/auction/teams/player/${id}`, {
      state: { id, setNo },
    });
  };

  // Filter and sort players
  const filteredPlayers = Players.filter(player => 
    player.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.setNo?.toString().includes(searchTerm)
  ).sort((a, b) => {
    switch(sortBy) {
      case "name":
        return a.name?.localeCompare(b.name);
      case "price-high":
        return (b.soldPrice || 0) - (a.soldPrice || 0);
      case "price-low":
        return (a.soldPrice || 0) - (b.soldPrice || 0);
      case "set":
        return (a.setNo || 0) - (b.setNo || 0);
      default:
        return 0;
    }
  });

  // Calculate stats
  const totalPlayers = Players.length;
  const totalSpent = Players.reduce((sum, player) => sum + (player.soldPrice || 0), 0);
  const avgPrice = totalPlayers ? Math.round(totalSpent / totalPlayers) : 0;
  const maxPrice = Math.max(...Players.map(p => p.soldPrice || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 via-slate-500 to-slate-800">
      <NavBar />

      {/* Header Section */}
      <div className="backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-indigo-400 rounded-full"></div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Team Players</h1>
              </div>
              <p className="text-white/60 text-sm mt-1 ml-4">
                {totalPlayers} players • ₹{totalSpent.toLocaleString()} total spent
              </p>
            </div>
            
            {/* Stats Summary */}
            <div className="flex items-center gap-3">
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg px-3 py-1.5">
                <p className="text-white/40 text-xs">Avg Price</p>
                <p className="text-white font-semibold text-sm">₹{avgPrice.toLocaleString()}</p>
              </div>
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg px-3 py-1.5">
                <p className="text-white/40 text-xs">Highest</p>
                <p className="text-green-400 font-semibold text-sm">₹{maxPrice.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search players by name or set number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all text-white placeholder-white/50"
                />
                <svg className="w-5 h-5 text-white/50 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="sm:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all text-white"
              >
                <option value="name" className="bg-slate-800">Sort by: Name</option>
                <option value="price-high" className="bg-slate-800">Sort by: Price (High to Low)</option>
                <option value="price-low" className="bg-slate-800">Sort by: Price (Low to High)</option>
                <option value="set" className="bg-slate-800">Sort by: Set Number</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || sortBy !== "name") && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-white/10">
              <span className="text-sm text-white/60">Active Filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                  Search: {searchTerm}
                  <button onClick={() => setSearchTerm("")} className="hover:text-blue-200 ml-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {sortBy !== "name" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-500/30">
                  Sort: {sortBy === "price-high" ? "Price (High)" : sortBy === "price-low" ? "Price (Low)" : "Set Number"}
                  <button onClick={() => setSortBy("name")} className="hover:text-green-200 ml-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <p className="text-sm text-white/60">
          Showing <span className="font-semibold text-white">{filteredPlayers.length}</span> of{" "}
          <span className="font-semibold text-white">{Players.length}</span> players
        </p>
      </div>

      {/* Players Grid */}
      {filteredPlayers.length > 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlayers.map((player) => (
              <div
                key={player.playerId}
                onClick={() => handleNavigate(player.playerId, player.setNo)}
                className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-xl hover:shadow-2xl cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-white/20"
              >
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={
                      player.imagePlayer ||
                      player.imageUrl ||
                      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80"
                    }
                    alt={player.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                  
                  {/* Set Badge */}
                  <div className="absolute top-3 right-3 backdrop-blur-md bg-white/10 border border-white/20 px-3 py-1 rounded-full shadow-md">
                    <span className="text-white/90 text-xs font-medium">Set #{player.setNo}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-3 line-clamp-1">
                    {player.name}
                  </h3>

                  <div className="space-y-2.5 mb-4">
                    {/* Sold Price */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1.5 text-white/60">
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Sold Price</span>
                      </div>
                      <span className="font-semibold text-green-400">
                        ₹{player.soldPrice?.toLocaleString()}
                      </span>
                    </div>

                    {/* Set Number (alternative display) */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1.5 text-white/60">
                        <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 01.586 1.414V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
                        </svg>
                        <span>Set Number</span>
                      </div>
                      <span className="font-semibold text-indigo-400">#{player.setNo}</span>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <button className="w-full py-2.5 bg-blue-600/80 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 group/btn backdrop-blur-sm border border-blue-500/30">
                    View Details
                    <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="text-center py-16 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl">
            <div className="text-white/30 mb-4">
              <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No players found</h3>
            <p className="text-white/60 mb-6">
              {Players.length === 0 ? "This team hasn't purchased any players yet" : "Try adjusting your search criteria"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="px-6 py-2 bg-blue-600/80 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors backdrop-blur-sm border border-blue-500/30"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTeamPlayers;