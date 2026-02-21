import React, { useEffect, useState } from "react";
import NavBar from "../../Components/Common/NavBar";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DOMAIN = import.meta.env.VITE_DOMAIN;

const TeamCard = ({ team }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/user/teams/player/${team._id}`, {
      state: team.players,
    });
  };

  return (
    <div
      onClick={handleNavigate}
      className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl hover:shadow-2xl cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-2"
    >
      {/* Card Header with Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={team.bannerImage || "https://images.unsplash.com/photo-1747134392471-831ea9a48e1e?q=80&w=2000"}
          alt={`${team.teamName} Banner`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
        
        {/* Team Icon */}
        <div className="absolute bottom-3 right-3 w-12 h-12 rounded-xl backdrop-blur-md bg-white/20 border border-white/30 flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-xl">
            {team.teamName?.charAt(0) || 'T'}
          </span>
        </div>

        {/* Team Badge */}
        <div className="absolute top-3 left-3 backdrop-blur-md bg-white/20 border border-white/30 px-3 py-1 rounded-full shadow-md">
          <span className="text-white text-xs font-medium">#{team.jerseyNumber || '00'}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-3 line-clamp-1">
          {team.teamName}
        </h3>

        <div className="space-y-2.5">
          {/* Purse */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5 text-white/70">
              <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Purse</span>
            </div>
            <span className="font-semibold text-green-300">₹{team.purse?.toLocaleString()}</span>
          </div>

          {/* Players */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5 text-white/70">
              <svg className="w-4 h-4 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>Players</span>
            </div>
            <span className="font-semibold text-indigo-300">{team.players?.length || 0}</span>
          </div>

          {/* Remaining Purse */}
          {team.remainingPurse && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5 text-white/70">
                <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span>Remaining</span>
              </div>
              <span className="font-semibold text-purple-300">₹{team.remainingPurse.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* View Details Button */}
        <div className="mt-4 pt-3 border-t border-white/20">
          <button className="w-full py-2 text-sm font-medium text-blue-300 hover:text-blue-200 transition-colors flex items-center justify-center gap-1 group/btn">
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

const UserTeam = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterPurse, setFilterPurse] = useState("all");

  const fetchData = async () => {
    try {
      setLoading(true);
      const auctionId = localStorage.getItem("auctionId");

      const response = await axios.post(
        DOMAIN + "/auction/get-teams",
        { auctionId },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setData(response.data.data);
        setFilteredData(response.data.data);
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter and sort data
  useEffect(() => {
    let result = [...data];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(team => 
        team.teamName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply purse filter
    if (filterPurse !== "all") {
      const [min, max] = filterPurse.split("-").map(Number);
      result = result.filter(team => {
        if (max) {
          return team.purse >= min && team.purse <= max;
        } else {
          return team.purse >= min;
        }
      });
    }

    // Apply sorting
    result.sort((a, b) => {
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

    setFilteredData(result);
  }, [searchTerm, sortBy, filterPurse, data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <NavBar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-white border-r-transparent"></div>
            <p className="mt-4 text-white/70 font-medium">Loading teams...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-500 to-slate-900">
      <NavBar />

      {/* Header Section */}
      <div className="backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-indigo-400 rounded-full"></div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Teams</h1>
              </div>
              <p className="text-white/60 text-sm mt-1 ml-4">
                Manage and view all auction teams
              </p>
            </div>
            
            {/* Refresh Button */}
            <button
              onClick={fetchData}
              className="inline-flex items-center gap-2 px-4 py-2 backdrop-blur-md bg-white/10 hover:bg-white/20 text-black rounded-lg transition-colors text-sm font-medium border border-white/20"
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Bar */}
            <div className="md:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search teams by name..."
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
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all text-white"
              >
                <option value="name" className="bg-slate-800">Sort by: Name</option>
                <option value="purse-high" className="bg-slate-800">Sort by: Purse (High to Low)</option>
                <option value="purse-low" className="bg-slate-800">Sort by: Purse (Low to High)</option>
                <option value="players" className="bg-slate-800">Sort by: Most Players</option>
              </select>
            </div>

            {/* Filter Dropdown */}
            <div>
              <select
                value={filterPurse}
                onChange={(e) => setFilterPurse(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all text-white"
              >
                <option value="all" className="bg-slate-800">All Purse Ranges</option>
                <option value="0-10000000" className="bg-slate-800">Under ₹1Cr</option>
                <option value="10000000-20000000" className="bg-slate-800">₹1Cr - ₹2Cr</option>
                <option value="20000000-30000000" className="bg-slate-800">₹2Cr - ₹3Cr</option>
                <option value="30000000-50000000" className="bg-slate-800">₹3Cr - ₹5Cr</option>
                <option value="50000000" className="bg-slate-800">Above ₹5Cr</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || sortBy !== "name" || filterPurse !== "all") && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
              <span className="text-sm text-white/60">Active Filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                  Search: {searchTerm}
                  <button onClick={() => setSearchTerm("")} className="hover:text-blue-200">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {sortBy !== "name" && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-500/30">
                  Sort: {sortBy === "purse-high" ? "Purse (High)" : sortBy === "purse-low" ? "Purse (Low)" : "Most Players"}
                  <button onClick={() => setSortBy("name")} className="hover:text-green-200">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {filterPurse !== "all" && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30">
                  Purse: {filterPurse}
                  <button onClick={() => setFilterPurse("all")} className="hover:text-purple-200">
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
          Showing <span className="font-semibold text-white">{filteredData.length}</span> of{" "}
          <span className="font-semibold text-white">{data.length}</span> teams
        </p>
      </div>

      {/* Teams Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredData.map((team) => (
              <TeamCard key={team._id} team={team} />
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
            <p className="text-white/60 mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSortBy("name");
                setFilterPurse("all");
              }}
              className="px-6 py-2 bg-blue-600/80 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors backdrop-blur-sm border border-blue-500/30"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserTeam;