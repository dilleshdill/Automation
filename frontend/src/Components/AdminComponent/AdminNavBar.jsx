import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const DOMAIN = import.meta.env.VITE_DOMAIN;

const AdminNavBar = () => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchName = async () => {
      try {
        const res = await axios.get(`${DOMAIN}/user/getName`, {
          withCredentials: true,
        });

        if (res.status === 200) {
          setName(res.data?.name ?? "");
        }
      } catch (error) {
        toast.error("Failed to fetch user details");
      }
    };

    fetchName();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${DOMAIN}/admin/logout`, {
        withCredentials: true,
      });

      if (res.status === 200) {
        toast.success("Logged out successfully 👋");
        navigate("/login");
      }
    } catch (err) {
      toast.error("Logout failed! Try again.");
      console.log(err);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo / Brand */}
          <div
            className="text-xl font-semibold text-slate-800 tracking-wide cursor-pointer"
            onClick={() => navigate("/admin")}
          >
            Auction Admin
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 text-slate-600 font-medium">
            <Link to="/admin" className="hover:text-slate-900 transition">
              Home
            </Link>
            <Link to="/auction/teams" className="hover:text-slate-900 transition">
              Teams
            </Link>
          </div>

          {/* Profile & Mobile Toggle */}
          <div className="flex items-center gap-4 relative">
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden text-slate-600 hover:text-slate-900 transition"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>

            {/* Profile Icon */}
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 focus:outline-none"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold uppercase">
                {name?.[0] ?? "A"}
              </div>
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 top-14 w-44 bg-white border border-slate-200 rounded-lg shadow-lg animate-fadeIn">
                <Link
                  to="/admin/profile"
                  className="block px-4 py-2 text-slate-700 hover:bg-slate-100 transition"
                >
                  Profile
                </Link>
                <Link
                  to="/admin/create-auction"
                  className="block px-4 py-2 text-slate-700 hover:bg-slate-100 transition"
                >
                  Create Auction
                </Link>
                <button
                  disabled
                  className="block px-4 py-2 w-full text-left text-slate-500 hover:bg-slate-100 cursor-not-allowed"
                >
                  Settings
                </button>
                <div className="border-t border-slate-200"></div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav Links */}
      {open && (
        <div className="md:hidden bg-gray-50 border-t border-slate-200 animate-slideDown">
          <div className="px-4 py-3 space-y-3 text-slate-700 font-medium">
            <Link to="/admin" className="block hover:text-slate-900">
              Home
            </Link>
            <Link to="/auction/teams" className="block hover:text-slate-900">
              Teams
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNavBar;
