import React from "react";
import { useNavigate } from "react-router-dom";
import BidderNavBar from "../../Components/BidderComponent/BidderNavBar";

const BidderAuctionEnded = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen min-w-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-200">
      <BidderNavBar />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        
        <div className="bg-white shadow-md border border-slate-200 rounded-xl max-w-xl w-full p-10 flex flex-col items-center">

          {/* Header */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full !bg-green-100 flex items-center justify-center border border-green-200 shadow-sm">
              <span className="text-2xl">✔️</span>
            </div>

            <h1 className="text-[26px] md:text-[30px] font-semibold text-slate-800 tracking-tight mt-4">
              Auction Completed
            </h1>

            <p className="text-sm text-slate-600 mt-2">
              Thank you for participating!
            </p>
          </div>

          {/* Image */}
          <img
            src="https://cdn-icons-png.flaticon.com/512/9774/9774899.png"
            alt="Auction Ended"
            className="w-40 mt-6 opacity-95"
          />

          {/* Description */}
          <p className="text-sm text-slate-500 mt-5 text-center max-w-sm leading-relaxed">
            Final results are now available. You may return to dashboard or
            check detailed outcomes for your team.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8 w-full">
            <button
              onClick={() => navigate("/bidder/auctions")}
              className="flex-1 px-6 py-2.5 !bg-blue-600 hover:!bg-blue-700 text-white text-sm rounded-lg font-medium shadow-sm transition"
            >
              Go to Dashboard
            </button>

            <button
              onClick={() => navigate("/auction/results")}
              className="flex-1 px-6 py-2.5 !bg-green-600 hover:!bg-green-700 text-white text-sm rounded-lg font-medium shadow-sm transition"
            >
              View Results
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BidderAuctionEnded;
