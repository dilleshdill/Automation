import { React, useEffect, useState } from "react";
import BidderHomeNavBar from "../../Components/BidderComponent/BidderHomeNavBar";
import axios from "axios";

const DOMAIN = import.meta.env.VITE_DOMAIN;

const BidderProfile = () => {
  const [BidderData, setBidderData] = useState({});

  const fetchedData = async () => {
    try {
    
      const res = await axios.get(
        `${DOMAIN}/bidder/get-bidder`,

        { withCredentials: true }
      );

      if (res.status === 200) {
        setBidderData(res.data?.data ?? {});
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchedData();
  }, []);

  return (
    <div className="min-h-screen min-w-screen !bg-[#eef1f4] flex flex-col">
      <BidderHomeNavBar />

      <div className="flex justify-center items-start mt-16 px-6 pb-20 w-full">
        <div className="bg-white w-full max-w-4xl rounded-xl shadow-md border border-slate-200 p-10 flex flex-col lg:flex-row gap-10">

          {/* LEFT CONTENT */}
          <div className="flex flex-col flex-1 justify-center">
            {/* Title + badge */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full !bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
                {BidderData?.teamName?.[0] ?? "B"}
              </div>
              <h1 className="text-3xl font-semibold text-slate-800 tracking-tight">
                {BidderData?.teamName ?? "Team Name"}
              </h1>
            </div>

            {/* Email */}
            <p className="text-sm text-slate-600 mb-4">
              Email: <span className="font-medium text-slate-800">{BidderData?.email ?? "-"}</span>
            </p>

            {/* Purse (Added — important for bidder) */}
            <div className="mt-4">
              <p className="text-xs uppercase font-semibold text-slate-500 tracking-wide">
                Purse Remaining
              </p>
              <p className="text-xl font-bold text-green-700">
                ₹{BidderData?.purse ?? 0}
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-200 my-6" />

            {/* Additional info (can expand later) */}
            <div className="space-y-2">
              <p className="text-xs uppercase font-semibold text-slate-500 tracking-wider">
                Franchise Status
              </p>
              <p className="text-[15px] font-medium text-slate-800">
                Active Bidder
              </p>
            </div>
          </div>

          {/* IMAGE SECTION */}
          <div className="flex justify-center items-center flex-1">
            <img
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/hero-section-showcase-3.png"
              alt="hero"
              className="max-w-xs sm:max-w-sm lg:max-w-md drop-shadow-md transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidderProfile;
