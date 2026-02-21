import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavBar from "../../Components/AdminComponent/AdminNavBar";

const AuctionEnded = () => {
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
    <div className="min-h-screen relative overflow-x-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Premium Stadium Background Effects */}
      <div className="fixed inset-0 z-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800/90 to-slate-900"></div>
        
        {/* Animated spotlights */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-slate-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-slate-400/10 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl"></div>
        </div>

        {/* Stadium seating pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-48">
          {[...Array(5)].map((_, row) => (
            <div 
              key={row} 
              className="absolute bottom-0 left-0 right-0 flex justify-center gap-1"
              style={{ 
                bottom: `${row * 30}px`,
                opacity: 0.2 - (row * 0.03)
              }}
            >
              {[...Array(40)].map((_, i) => (
                <div 
                  key={i}
                  className="w-2 h-4 bg-slate-400/20 rounded-t-sm"
                  style={{
                    animation: `crowdMove ${Math.random() * 3 + 2}s ease-in-out infinite`,
                    transform: `translateY(${Math.sin(i) * 2}px)`
                  }}
                ></div>
              ))}
            </div>
          ))}
        </div>

        {/* Stadium arch lights */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-400/20 to-transparent"></div>
        
        {/* Trophy glow */}
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <AdminNavBar />

      <div className="relative z-10 min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
        <div className="max-w-3xl w-full">
          {/* Main Card with Premium Slate Design */}
          <div 
            className="relative group"
            style={{
              animation: `cardAppear 0.6s ease-out both`
            }}
          >
            {/* Animated border glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            
            {/* Main card */}
            <div className="relative backdrop-blur-xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
              
              {/* Top gradient bar */}
              <div className="h-1.5 bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400"></div>
              
              {/* Light effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500 pointer-events-none"></div>
              
              <div className="relative p-8 md:p-12">
                
                {/* Trophy Icon with Celebration Animation */}
                <div className="relative mx-auto w-32 h-32 mb-8">
                  {/* Pulsing rings */}
                  <div className="absolute inset-0 bg-amber-500/20 rounded-full animate-ping"></div>
                  <div className="absolute inset-2 bg-amber-500/30 rounded-full animate-ping delay-300"></div>
                  
                  {/* Trophy */}
                  <div className="relative w-full h-full bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-2xl shadow-amber-500/30 transform hover:scale-110 transition-transform duration-500">
                    <span className="text-5xl animate-bounce">🏆</span>
                  </div>
                  
                  {/* Confetti dots */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-amber-400 rounded-full animate-ping"></div>
                  <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-slate-400 rounded-full animate-ping delay-500"></div>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-black text-center mb-4">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-white to-slate-200">
                    AUCTION CONCLUDED
                  </span>
                  <span className="inline-block ml-4 text-5xl animate-wiggle">🎉</span>
                </h1>
                
                {/* Subtitle */}
                <p className="text-slate-300 text-center text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
                  An incredible journey comes to an end. Thank you to all franchises, 
                  bidders, and participants for making this auction a grand success!
                </p>

                {/* Stats Cards - Animated on mount */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                  {[
                    { icon: "🏆", value: "24", label: "Players Sold", color: "from-amber-500 to-amber-600" },
                    { icon: "💰", value: "₹128Cr", label: "Total Spent", color: "from-green-500 to-green-600" },
                    { icon: "👥", value: "8", label: "Teams", color: "from-blue-500 to-blue-600" }
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className={`transform transition-all duration-700 delay-${index * 200} ${
                        showStats ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                      }`}
                    >
                      <div className="relative group/stat">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-500 to-slate-400 rounded-xl blur opacity-20 group-hover/stat:opacity-30 transition"></div>
                        <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 p-5 text-center hover:border-slate-500/50 transition-all">
                          <div className={`inline-block p-3 bg-gradient-to-br ${stat.color} rounded-full shadow-lg mb-3`}>
                            <span className="text-2xl">{stat.icon}</span>
                          </div>
                          <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                          <div className="text-xs uppercase tracking-wider text-slate-400">{stat.label}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
                  {[
                    { label: "Total Bids", value: "1,247", icon: "⚡" },
                    { label: "Highest Bid", value: "₹14.5Cr", icon: "📈" },
                    { label: "Most Expensive", value: "Virat K.", icon: "⭐" },
                    { label: "Unsold", value: "8", icon: "📉" }
                  ].map((item, index) => (
                    <div key={index} className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 text-center">
                      <div className="text-slate-400 text-xs mb-1 flex items-center justify-center gap-1">
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      <div className="text-white font-bold text-sm">{item.value}</div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate("/admin")}
                    className="group relative px-8 py-3.5 bg-gradient-to-r from-slate-700 to-slate-800 text-white font-bold rounded-xl shadow-lg shadow-slate-900/50 overflow-hidden hover:shadow-xl hover:shadow-slate-800/50 transform hover:scale-105 transition-all duration-300"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-slate-600 to-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      DASHBOARD
                    </span>
                  </button>

                  <button
                    onClick={() => navigate("/auction/results")}
                    className="group relative px-8 py-3.5 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-900/30 overflow-hidden hover:shadow-xl hover:shadow-green-800/30 transform hover:scale-105 transition-all duration-300"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      VIEW FULL RESULTS
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </button>
                </div>

                {/* Auto-redirect indicator */}
                <div className="mt-8 text-center">
                  <div className="inline-flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-700/50">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-500"></span>
                    </span>
                    <span className="text-xs text-slate-400">
                      Redirecting to dashboard in {countdown}s
                    </span>
                  </div>
                </div>

                {/* Summary Note */}
                <div className="mt-6 text-center">
                  <p className="text-xs text-slate-500 flex items-center justify-center gap-2">
                    <span>✨</span>
                    Final results and player allocations are now available for review
                    <span>✨</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add keyframe animations */}
      <style jsx>{`
        @keyframes crowdMove {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes cardAppear {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-10deg) scale(1.1); }
          75% { transform: rotate(10deg) scale(1.1); }
        }
        
        .animate-wiggle {
          animation: wiggle 1s ease-in-out;
        }
        
        .delay-200 {
          transition-delay: 200ms;
        }
        
        .delay-400 {
          transition-delay: 400ms;
        }
        
        .delay-600 {
          transition-delay: 600ms;
        }
      `}</style>
    </div>
  );
};

export default AuctionEnded;