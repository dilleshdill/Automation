import React from "react";
import { useNavigate } from "react-router-dom";
import AdminNavBar from "../../Components/AdminComponent/AdminNavBar";

const AuctionEnded = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <AdminNavBar />

      <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          🎉 Auction Ended!
        </h1>

        <p className="text-lg text-gray-600 mb-6">
          The auction has successfully concluded. Thank you for participating!
        </p>

        <img
          src="https://cdn-icons-png.flaticon.com/512/9774/9774899.png"
          alt="Auction Ended"
          className="w-48 mb-6 opacity-90"
        />

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/admin")}
            className="px-6 py-2 !bg-blue-600 text-white rounded-lg font-medium hover:!bg-blue-700"
          >
            Go to Dashboard
          </button>

          <button
            onClick={() => navigate("/auction/results")}
            className="px-6 py-2 !bg-green-600 text-white rounded-lg font-medium hover:!bg-green-700"
          >
            View Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuctionEnded;
