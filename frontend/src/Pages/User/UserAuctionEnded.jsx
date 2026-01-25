import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../Components/Common/NavBar';

const UserAuctionEnded = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen min-w-screen flex flex-col relative">

      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-blue-900 to-blue-700 -z-20" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30 -z-10" />

      <NavBar />

      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-10">

        {/* Card */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 shadow-xl rounded-2xl max-w-2xl w-full p-10 flex flex-col items-center">

          <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-wide">
            🎉 Auction Completed!
          </h1>

          <p className="text-sm md:text-base text-blue-100 mt-3 leading-relaxed">
            Thank you for participating! The auction has officially ended.
          </p>

          <img
            src="https://cdn-icons-png.flaticon.com/512/9774/9774899.png"
            alt="Auction Ended"
            className="w-40 mt-6 opacity-90"
          />

          <p className="text-sm text-blue-200 mt-4">
            You can revisit your dashboard or check the final results anytime.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">
            <button
              onClick={() => navigate('/user/auctions')}
              className="px-6 py-2.5 !bg-blue-600 hover:!bg-blue-700 text-white rounded-lg font-medium shadow transition"
            >
              Go to Dashboard
            </button>

            <button
              onClick={() => navigate('/auction/results')}
              className="px-6 py-2.5 !bg-green-600 hover:!bg-green-700 text-white rounded-lg font-medium shadow transition"
            >
              View Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAuctionEnded;
