import React from "react";
import { useNavigate } from "react-router-dom";
import AdminNavBar from "../../Components/AdminComponent/AdminNavBar";

const AuctionEnded = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen min-w-screen flex flex-col !bg-gradient-to-br from-[#e9edf3] to-[#f6f7f9]">
      <AdminNavBar />

      <div className="flex flex-1 justify-center items-center px-4">
        <div className="max-w-xl w-full bg-white rounded-xl shadow-lg border border-slate-200 p-10 flex flex-col items-center text-center">
          
          <div className="text-4xl font-semibold text-slate-800 mb-3">
            Auction Concluded 🎉
          </div>
          
          <p className="text-slate-600 text-[15px] leading-relaxed mb-6">
            This auction has officially ended. Thank you to all franchises, bidders,
            and participants for making it successful!
          </p>

          <img
            src="https://cdn-icons-png.flaticon.com/512/9774/9774899.png"
            alt="Auction Ended"
            className="w-40 mb-8 opacity-95 drop-shadow-md"
          />

          <div className="flex gap-4 w-full justify-center">
            <button
              onClick={() => navigate("/admin")}
              className="px-6 py-2 rounded-lg font-medium shadow-sm !bg-blue-600 text-white hover:!bg-blue-700 transition"
            >
              Go to Dashboard
            </button>

            <button
              onClick={() => navigate("/auction/results")}
              className="px-6 py-2 rounded-lg font-medium shadow-sm !bg-green-600 text-white hover:!bg-green-700 transition"
            >
              View Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionEnded;
