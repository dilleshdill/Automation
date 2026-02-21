import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../Components/Common/NavBar';

const UserAuctionEnded = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const [showStats, setShowStats] = useState(false);

  // Auto redirect countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Stats animation on mount
  useEffect(() => {
    setTimeout(() => setShowStats(true), 300);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <NavBar />

      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Main Glass Card */}
          <div 
            className="group"
            style={{
              animation: `cardAppear 0.6s ease-out both`
            }}
          >
            {/* Glass card with subtle border */}
            <div className="backdrop-blur-md bg-white/10 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              
              {/* Subtle top bar */}
              <div className="h-1 bg-gradient-to-r from-slate-400/50 via-slate-300/50 to-slate-400/50"></div>
              
              <div className="relative p-8 md:p-10">
                
                {/* Icon */}
                <div className="relative mx-auto w-24 h-24 mb-6">
                  <div className="w-full h-full bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/20">
                    <span className="text-4xl">🏆</span>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-semibold text-white text-center mb-3">
                  Auction Completed
                </h1>
                
                {/* Subtitle */}
                <p className="text-slate-300 text-center text-sm md:text-base leading-relaxed mb-8">
                  Thank you for participating in the auction. 
                  The event has successfully concluded.
                </p>

                {/* Stats Cards - Glass Grid */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {[
                    { icon: "⚡", value: "156", label: "Total Bids" },
                    { icon: "💰", value: "₹245Cr", label: "Total Spent" },
                    { icon: "🏏", value: "24", label: "Players Sold" },
                    { icon: "👥", value: "8", label: "Teams" }
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className={`transform transition-all duration-700 delay-${index * 150} ${
                        showStats ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                      }`}
                    >
                      <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition-all">
                        <div className="text-2xl mb-2 text-slate-300">{stat.icon}</div>
                        <div className="text-xl font-semibold text-white mb-1">{stat.value}</div>
                        <div className="text-xs text-slate-400">{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary Message */}
                <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl text-slate-300">📋</div>
                    <div>
                      <p className="text-white text-sm font-medium">Your Participation Summary</p>
                      <p className="text-slate-400 text-xs mt-1">
                        You placed 12 bids and secured 2 players. Total spend: ₹8.5Cr
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => navigate('/user/auctions')}
                    className="px-6 py-2.5 bg-white/20 hover:bg-white/30 text-black font-medium rounded-lg backdrop-blur-sm border border-white/20 transition-all"
                  >
                    Go to Dashboard
                  </button>

                  <button
                    onClick={() => navigate('/auction/results')}
                    className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-black font-medium rounded-lg backdrop-blur-sm border border-white/20 transition-all"
                  >
                    View Final Results
                  </button>
                </div>

                {/* Auto-redirect indicator */}
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center gap-2 backdrop-blur-md bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-400"></span>
                    </span>
                    <span className="text-xs text-slate-400">
                      Redirecting in {countdown}s
                    </span>
                  </div>
                </div>

                {/* Footer Note */}
                <div className="mt-6 text-center">
                  <p className="text-xs text-slate-500">
                    Final results are now available for review
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add keyframe animations */}
      <style jsx>{`
        @keyframes cardAppear {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default UserAuctionEnded;