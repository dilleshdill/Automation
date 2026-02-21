import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const DOMAIN = import.meta.env.VITE_DOMAIN;

const BidderNavBar = () => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [name, setName] = useState("");
  const [liveAuctions, setLiveAuctions] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState(3);
  const navigate = useNavigate();

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch live auction count
  useEffect(() => {
    const fetchLiveCount = async () => {
      try {
        const response = await axios.get(DOMAIN + "/bidder/live-auction-count", {
          withCredentials: true
        });
        if (response.status === 200) {
          setLiveAuctions(response.data.count);
        }
      } catch (err) {
        console.log(err);
      }
    };
    
    fetchLiveCount();
    const interval = setInterval(fetchLiveCount, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchName = async () => {
      try {
        const response = await axios.get(`${DOMAIN}/user/getName`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setName(response.data.userName ?? "");
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchName();
  }, []);

  const getLogout = async () => {
    try {
      const response = await axios.get(`${DOMAIN}/bidder/logout`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        toast.success("Logout Successfully");
        navigate("/login");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <nav className="sticky top-0 z-[999] w-screen
      bg-gradient-to-r from-slate-600 via-slate-200 to-slate-600 
      shadow-lg shadow-gray-400/30 
      backdrop-blur-xl 
      border-b border-gray-400/30 py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* LOGO */}
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/bidder/auctions")}
          >
            <span className="text-2xl animate-pulse">⚒️</span>
            <div>
              <h2 className="text-lg font-serif font-bold text-amber-900">Bidder Arena</h2>
              <p className="text-[10px] text-amber-600 -mt-1">PLACE YOUR BIDS</p>
            </div>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => navigate("/bidder/auctions")}
              className="relative text-gray-700 hover:text-amber-700 transition font-medium group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300"></span>
            </button>

            <button
              onClick={() => navigate("/auction/teams")}
              className="relative text-gray-700 hover:text-amber-700 transition font-medium group"
            >
              Teams
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300"></span>
            </button>
            
            {/* Live Auction Counter */}
            <div className="flex items-center gap-3 bg-amber-100/80 px-3 py-1.5 rounded-full border border-amber-200">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs font-medium text-amber-800">{liveAuctions} Live</span>
              </div>
              <div className="w-px h-4 bg-amber-300"></div>
              <span className="text-xs font-mono text-amber-700">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* PROFILE + MOBILE */}
          <div className="flex items-center gap-3 relative">
            
            {/* Notification Bell */}
            <button className="relative hidden sm:block text-gray-600 hover:text-amber-700 transition">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">
                  {notifications}
                </span>
              )}
            </button>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden text-gray-600 hover:text-amber-700 transition"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>

            {/* PROFILE BUTTON */}
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 group"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-semibold shadow-md group-hover:shadow-lg transition">
                {name ? name[0].toUpperCase() : "B"}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs text-gray-500">Welcome back</p>
                <p className="text-sm font-medium text-gray-700">{name || "Bidder"}</p>
              </div>
            </button>

            {/* PROFILE DROPDOWN */}
            {profileOpen && (
              <div className="absolute right-0 top-14 w-48 bg-white rounded-lg shadow-xl border border-amber-100 py-2 animate-fade">
                <div className="px-4 py-2 border-b border-amber-100">
                  <p className="text-sm font-medium text-gray-700">{name || "Bidder"}</p>
                  <p className="text-xs text-gray-500">Member since 2024</p>
                </div>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/bidder/profile");
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 transition"
                >
                  My Profile
                </button>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/bidder/history");
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 transition"
                >
                  Bidding History
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 transition"
                >
                  Settings
                </button>
                <div className="border-t border-amber-100 my-1" />
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    getLogout();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-amber-50 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white border-t border-amber-100 shadow-lg">
          <div className="px-4 py-3 space-y-2">
            <button
              onClick={() => {
                navigate("/bidder/auctions");
                setOpen(false);
              }}
              className="block w-full text-left py-2 text-gray-700 hover:text-amber-700 transition"
            >
              Home
            </button>
            <button
              onClick={() => {
                navigate("/auction/teams");
                setOpen(false);
              }}
              className="block w-full text-left py-2 text-gray-700 hover:text-amber-700 transition"
            >
              Teams
            </button>
            
            {/* Live indicator for mobile */}
            <div className="flex items-center justify-between pt-2 mt-2 border-t border-amber-100">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs text-gray-600">{liveAuctions} Live Auctions</span>
              </div>
              <span className="text-xs font-mono text-amber-600">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default BidderNavBar;