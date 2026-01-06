import axios from "axios";
import React, { useEffect, useState } from "react";
const DOMAIN = import.meta.env.VITE_DOMAIN;

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [name,setName] = useState("");

  useEffect(() => {
    const fetchName = async() => {
        const response = await axios.get(DOMAIN + "user/getName");
        if (response.status === 200){
            setName(response.data.name);
        }
    }
    fetchName();
  },[])

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm top-0 min-w-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          
          <div className="text-lg font-bold text-gray-700 ">
            Auction
          </div>

          
          <div className="hidden md:flex space-x-10 text-gray-600 font-medium">
            <a className="hover:text-gray-700 cursor-pointer">Home</a>
            <a className="hover:text-gray-700 cursor-pointer">Players</a>
            <a className="hover:text-gray-700 cursor-pointer">Teams</a>
            <a className="hover:text-gray-600 cursor-pointer">Auction</a>
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
                <a className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                  Profile
                </a>
                <a className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                  Settings
                </a>
                <div className="border-t border-gray-200"></div>
                <a className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
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
            <a className="block">Home</a>
            <a className="block">Players</a>
            <a className="block">Teams</a>
            <a className="block">Auction</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
