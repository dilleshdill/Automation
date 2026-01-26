import { React, useEffect, useState } from "react";
import axios from "axios";
import UserHomeNavBar from "../../Components/User/UserHomeNavBar";

const DOMAIN = import.meta.env.VITE_DOMAIN;

const UserProfile = () => {
  const [userData, setUserData] = useState({});

  const fetchedData = async () => {
    try {
      const userId = localStorage.getItem("userId");

      const response = await axios.post(
        DOMAIN + "/user/get-user",
        { userId },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setUserData(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchedData()
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <UserHomeNavBar />

      <div className="flex flex-col md:flex-row gap-10 lg:gap-20 items-center justify-between py-16 px-4 md:px-16 lg:px-28 xl:px-40">

        {/* LEFT SECTION */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          
          {/* Fancy Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-400 bg-white shadow-sm text-xs text-slate-600">
            <div className="flex -space-x-2">
              <img
                className="size-7 rounded-full border border-white shadow"
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80"
                alt="user1"
              />
              <img
                className="size-7 rounded-full border border-white shadow"
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80"
                alt="user2"
              />
              <img
                className="size-7 rounded-full border border-white shadow"
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80"
                alt="user3"
              />
            </div>
            <span>Enjoy the Auction</span>
          </div>

          {/* NAME */}
          <h1 className="text-center md:text-left text-5xl md:text-6xl font-semibold leading-tight text-slate-700">
            {userData.userName}
          </h1>

          {/* EMAIL */}
          <p className="text-center md:text-left text-sm text-slate-500 tracking-wide">
            Email: {userData.email}
          </p>

          {/* Extra spacing */}
          <div className="mt-4" />
        </div>

        {/* RIGHT IMAGE SECTION */}
        <img
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/hero-section-showcase-3.png"
          alt="hero"
          className="max-w-xs sm:max-w-sm lg:max-w-md drop-shadow-xl hover:scale-[1.03] transition-all duration-300"
        />
      </div>
    </div>
  );
};

export default UserProfile;
