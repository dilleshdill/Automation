import React, { useEffect, useState } from "react";
import BidderNavBar from "../../Components/BidderComponent/BidderNavBar";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DOMAIN = import.meta.env.VITE_DOMAIN;

const TiltCard = ({ team }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const threshold = 18;

  const handleNavigate = () => {
    navigate(`/auction/teams/${team?._id}`, {
      state: team?.players ?? [],
    });
  };

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -threshold, y: x * threshold });
  };

  // Calculate spent amount
  const spent = team?.purse - (team?.remainingPurse || 0);
  const spentPercentage = team?.purse ? (spent / team.purse) * 100 : 0;

  return (
    <div
      onClick={handleNavigate}
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className="
        group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl
        shadow-xl hover:shadow-2xl cursor-pointer overflow-hidden
        max-w-[300px] w-full transition-all duration-300 hover:-translate-y-2
      "
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.15s ease-out",
      }}
    >
      {/* Image Container */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={
            team?.logo ||
            "https://images.unsplash.com/photo-1508341591423-4347099e1f19?auto=format&fit=crop&w=800&q=60"
          }
          alt={team?.teamName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
        
        {/* Team Icon */}
        <div className="absolute bottom-3 right-3 w-12 h-12 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-xl">
            {team?.teamName?.charAt(0) || 'T'}
          </span>
        </div>

        {/* Team Badge */}
        <div className="absolute top-3 left-3 backdrop-blur-md bg-white/10 border border-white/20 px-3 py-1 rounded-full shadow-md">
          <span className="text-white/90 text-xs font-medium">#{team?.jerseyNumber || '00'}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-3 line-clamp-1">
          {team?.teamName ?? "Team"}
        </h3>

        <div className="space-y-3">
          {/* Total Purse */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5 text-white/60">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Total Purse</span>
            </div>
            <span className="font-semibold text-blue-300">₹{team?.purse?.toLocaleString()}</span>
          </div>

          {/* Players Count */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5 text-white/60">
              <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>Players</span>
            </div>
            <span className="font-semibold text-indigo-300">{team?.players?.length || 0}</span>
          </div>

          {/* Remaining Purse */}
          {team?.remainingPurse !== undefined && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5 text-white/60">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span>Remaining</span>
              </div>
              <span className="font-semibold text-emerald-300">₹{team?.remainingPurse?.toLocaleString()}</span>
            </div>
          )}

          {/* Progress Bar */}
          <div className="pt-2">
            <div className="flex justify-between text-xs text-white/40 mb-1">
              <span>Spent</span>
              <span>{Math.round(spentPercentage)}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                style={{ width: `${spentPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* View Details Button */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <button className="w-full py-2.5 text-sm font-medium text-blue-300 hover:text-blue-200 transition-colors flex items-center justify-center gap-2 group/btn bg-white/5 rounded-lg hover:bg-white/10">
            View Team Details
            <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const auctionId = localStorage.getItem("auctionId");

      const res = await axios.post(
        `${DOMAIN}/auction/get-teams`,
        { auctionId },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setTeams(res?.data?.data ?? []);
      }
    } catch (err) {
      toast.error("Failed to load teams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // Filter and sort teams
  const filteredTeams = teams
    .filter(team => 
      team?.teamName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch(sortBy) {
        case "name":
          return a.teamName?.localeCompare(b.teamName);
        case "purse-high":
          return (b.purse || 0) - (a.purse || 0);
        case "purse-low":
          return (a.purse || 0) - (b.purse || 0);
        case "players":
          return (b.players?.length || 0) - (a.players?.length || 0);
        default:
          return 0;
      }
    });

  // Calculate stats
  const totalTeams = teams.length;
  const totalPlayers = teams.reduce((sum, team) => sum + (team.players?.length || 0), 0);
  const totalPurse = teams.reduce((sum, team) => sum + (team.purse || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <BidderNavBar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-yellow-400 border-r-transparent"></div>
            <p className="mt-4 text-white/70 font-medium">Loading teams...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <BidderNavBar />

      {/* Header Section */}
      <div className="backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-orange-400 rounded-full"></div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Auction Teams</h1>
              </div>
              <p className="text-white/60 text-sm mt-1 ml-4">
                {totalTeams} teams • {totalPlayers} players • ₹{totalPurse.toLocaleString()} total purse
              </p>
            </div>
            
            {/* Refresh Button */}
            <button
              onClick={fetchTeams}
              className="inline-flex items-center gap-2 px-4 py-2 backdrop-blur-md bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium border border-white/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
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
                  placeholder="Search teams by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-transparent transition-all text-white placeholder-white/50"
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
                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-transparent transition-all text-white"
              >
                <option value="name" className="bg-slate-800">Sort by: Name</option>
                <option value="purse-high" className="bg-slate-800">Sort by: Purse (High to Low)</option>
                <option value="purse-low" className="bg-slate-800">Sort by: Purse (Low to High)</option>
                <option value="players" className="bg-slate-800">Sort by: Most Players</option>
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
                  Sort: {sortBy === "purse-high" ? "Purse (High)" : sortBy === "purse-low" ? "Purse (Low)" : "Most Players"}
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
          Showing <span className="font-semibold text-white">{filteredTeams.length}</span> of{" "}
          <span className="font-semibold text-white">{teams.length}</span> teams
        </p>
      </div>

      {/* Team Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {filteredTeams.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 place-items-center">
            {filteredTeams.map((team) => (
              <TiltCard key={team?._id} team={team} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl">
            <div className="text-white/30 mb-4">
              <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No teams found</h3>
            <p className="text-white/60 mb-6">Try adjusting your search criteria</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSortBy("name");
              }}
              className="px-6 py-2 bg-yellow-500/80 hover:bg-yellow-500 text-white font-medium rounded-lg transition-colors backdrop-blur-sm border border-yellow-500/30"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamsPage;