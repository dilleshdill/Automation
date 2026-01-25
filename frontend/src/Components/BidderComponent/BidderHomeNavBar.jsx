import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const DOMAIN = import.meta.env.VITE_DOMAIN;

const BidderHomeNavBar = () => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchName = async () => {
      const response = await axios.get(DOMAIN + "/user/getName", {
        withCredentials: true,
      });
      if (response.status === 200) {
        setName(response.data.name);
      }
    };
    fetchName();
  }, []);

  const getLogout = async () => {
    try {
      const response = await axios.get(DOMAIN + "/bidder/logout", {
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
    <nav className="bg-white border-b border-gray-200 shadow-sm top-0 min-w-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="text-lg font-bold text-gray-700 ">Auction</div>

          <div className="hidden md:flex space-x-5 text-gray-600 font-medium">
            <a
              href="/bidder/auctions"
              className="hover:text-gray-700 cursor-pointer"
            >
              Home
            </a>
            <a
              href="/bidder/history"
              className="hover:text-gray-700 cursor-pointer"
            >
              History
            </a>

          </div>

          <div className="flex items-center gap-4 relative">
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

            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 focus:outline-none"
            >
              <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold">
                {name[0]}
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-14 w-40 bg-white border border-gray-200 rounded-lg shadow-md">
                <a
                  href="/bidder/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Profile
                </a>
                <a className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                  Settings
                </a>
                <div className="border-t border-gray-200"></div>
                <a
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={getLogout}
                >
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-gray-50 border-t border-gray-200">
          <div className="px-4 py-3 space-y-3 text-gray-700 font-medium">
            <a href="/bidder/auctions" className="block">
              Home
            </a>
            <a href="/bidder/history" className="block">
              History
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default BidderHomeNavBar;
