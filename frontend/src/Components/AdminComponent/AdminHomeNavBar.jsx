import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

const DOMAIN = import.meta.env.VITE_DOMAIN;

const AdminHomeNavBar = () => {
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
          setName(response.data?.name ?? "");
        }
      } catch (err) {
        console.log(err)
        
      }
    };

    fetchName();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${DOMAIN}/admin/logout`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success("Logged out successfully 👋");
        navigate("/login");
      }
    } catch (err) {
      toast.error("Logout failed! Try again.");
      console.log(err);
    }
  };

  return (
    <nav className="min-w-screen bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <div 
            className="text-lg font-semibold text-gray-800 cursor-pointer"
            onClick={() => navigate("/admin")}
          >
            Auction Admin
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 text-gray-600 font-medium">
            <Link to="/admin" className="hover:text-gray-900 transition">
              Home
            </Link>
            <Link to="/admin/create-auction" className="hover:text-gray-900 transition">
              Create Auction
            </Link>
          </div>

          {/* Profile / Mobile Button */}
          <div className="flex items-center gap-3 relative">
            
            {/* Mobile Toggle */}
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
              <div className="w-10 h-10 rounded-full !bg-blue-100 text-blue-700 flex items-center justify-center font-semibold uppercase">
                {name?.[0] ?? "A"}
              </div>
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 top-14 w-44 bg-white border border-gray-200 rounded-lg shadow-lg fade-in">
                <Link to="/admin/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Profile
                </Link>
                <Link to="/admin/create-auction" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Create Auction
                </Link>
                <Link className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                  Settings
                </Link>
                <div className="border-t border-slate-200"></div>
                <button
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden !bg-gray-50 border-t border-gray-200">
          <div className="px-4 py-3 space-y-3 text-gray-700 font-medium">
            <Link to="/admin" className="block">
              Home
            </Link>
            <Link to="/admin/create-auction" className="block">
              Create Auction
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminHomeNavBar;
