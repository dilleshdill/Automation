import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const DOMAIN = import.meta.env.VITE_DOMAIN;

const BidderNavBar = () => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchName = async () => {
      try {
        const response = await axios.get(`${DOMAIN}/user/getName`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setName(response.data.name ?? "");
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
    <nav className="min-w-screen bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          
          <div
            className="text-lg font-semibold tracking-wide text-slate-800 cursor-pointer"
            onClick={() => navigate("/bidder/auctions")}
          >
            🏏 Auction
          </div>

          <div className="hidden md:flex items-center gap-6 text-slate-600 font-medium">
            <button
              onClick={() => navigate("/bidder/auctions")}
              className="hover:text-slate-900 transition"
            >
              Home
            </button>

            <button
              onClick={() => navigate("/auction/teams")}
              className="hover:text-slate-900 transition"
            >
              Teams
            </button>
          </div>

          {/* PROFILE */}
          <div className="flex items-center gap-4 relative">

            {/* MOBILE MENU ICON */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden text-slate-700 hover:text-slate-900"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>

            {/* PROFILE ICON */}
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2"
            >
              <div className="w-9 h-9 rounded-full !bg-slate-300 flex items-center justify-center text-slate-800 font-medium">
                {(name && name[0]?.toUpperCase()) || "B"}
              </div>
            </button>

            {/* DROPDOWN */}
            {profileOpen && (
              <div className="absolute right-0 top-14 w-40 bg-white border border-slate-200 rounded-lg shadow-md">
                <button
                  onClick={() => navigate("/bidder/profile")}
                  className="w-full text-left px-4 py-2 text-slate-700 hover:!bg-slate-100"
                >
                  Profile
                </button>

                <button
                  className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-100"
                >
                  Settings
                </button>

                <div className="border-t border-slate-200"></div>

                <button
                  onClick={getLogout}
                  className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden !bg-slate-50 border-t border-slate-200">
          <div className="px-4 py-3 space-y-3 text-slate-700 font-medium">
            <button onClick={() => navigate("/bidder/auctions")} className="block w-full text-left">
              Home
            </button>
            <button onClick={() => navigate("/auction/teams")} className="block w-full text-left">
              Teams
            </button>
            <button onClick={() => navigate("/bidder/auctions")} className="block w-full text-left">
              History
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default BidderNavBar;
