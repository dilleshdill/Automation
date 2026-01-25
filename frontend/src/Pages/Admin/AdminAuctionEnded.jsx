import React from "react";
import { useNavigate } from "react-router-dom";
import AdminNavBar from "../../Components/AdminComponent/AdminNavBar";

const AdminAuctionEnded = () => {
  const navigate = useNavigate();

  return (
    <div className="min-w-screen min-h-screen !bg-slate-50 flex flex-col">
      <AdminNavBar />

      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-10">
        
        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-semibold text-slate-800 mb-3">
          🎉 Auction Ended!
        </h1>

        {/* Description */}
        <p className="text-sm md:text-lg text-slate-600 max-w-2xl mb-6">
          The auction has successfully concluded. Thank you for participating and making it competitive and exciting.
        </p>

        {/* Image */}
        <img
          src="https://cdn-icons-png.flaticon.com/512/9774/9774899.png"
          alt="Auction Ended"
          className="w-40 md:w-52 opacity-95 mb-8"
          loading="lazy"
        />

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4 w-full justify-center max-w-md">
          <button
            onClick={() => navigate("/admin")}
            className="w-full md:w-auto px-6 py-2 !bg-blue-600 hover:!bg-blue-700 text-white rounded-lg font-medium transition"
          >
            Go to Dashboard
          </button>

          <button
            onClick={() => navigate("/auction/results")}
            className="w-full md:w-auto px-6 py-2 !bg-emerald-600 hover:!bg-emerald-700 text-white rounded-lg font-medium transition"
          >
            View Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAuctionEnded;
