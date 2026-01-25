import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const DOMAIN = import.meta.env.VITE_DOMAIN;

const UserHomeNavBar = () => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchName = async () => {
      const response = await axios.get(DOMAIN + "user/getName");
      if (response.status === 200) {
        setName(response.data.name);
      }
    };
    fetchName();
  }, []);

  const getLogout = async () => {
    try {
      const response = await axios.get(DOMAIN + "/user/logout", {
        withCredentials: true,
      });
      if (response.status === 200) {
        toast.success("Logout Successfully");
        navigate("/login");
      }
    } catch (err) {
      toast.error("Something went wrong", err);
    }
  };

  return (
    <nav className="sticky top-0 z-[999] min-w-screen bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm w-full">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* LOGO */}
          <h2 className="text-lg font-bold text-gray-700">Auction</h2>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex space-x-10 text-gray-600 font-medium">
            <a
              href="/user/auctions"
              className="hover:text-gray-800 transition cursor-pointer"
            >
              Home
            </a>
          </div>

          {/* PROFILE + MOBILE */}
          <div className="flex items-center gap-4 relative">
            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden text-gray-600 hover:text-gray-900"
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
              className="flex items-center gap-2"
            >
              <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold">
                {name ? name[0] : "U"}
              </div>
            </button>

            {/* PROFILE DROPDOWN */}
            {profileOpen && (
              <div className="absolute right-0 top-14 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-2 animate-fade">
                <a
                  href="/auction/user/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Profile
                </a>
                <a className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                  Settings
                </a>
                <div className="border-t border-gray-200" />
                <button
                  onClick={getLogout}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
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
        <div className="md:hidden bg-gray-50 border-t border-gray-200 transition-all duration-200">
          <div className="px-4 py-3 space-y-3 text-gray-700 font-medium">
            <a href="/user/auctions" className="block">
              Home
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default UserHomeNavBar;
