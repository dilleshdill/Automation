import React from "react";
import { useNavigate } from "react-router-dom";

const AdminAuctionNotStart = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Stadium Lights Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-64 h-1 bg-yellow-400/30 blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-1/4 w-64 h-1 bg-blue-400/30 blur-xl animate-pulse delay-300"></div>
      </div>

      {/* Moving Spotlight */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-full bg-gradient-to-r from-yellow-500/5 via-transparent to-transparent -skew-x-12 animate-spotlight-move"></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="relative max-w-4xl w-full">
          {/* Main Glass Card */}
          <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
            {/* Top gradient bar with stadium effect */}
            <div className="h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400"></div>
            
            {/* Corner Stadium Lights */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-yellow-500/20 to-transparent"></div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-yellow-500/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-orange-500/20 to-transparent"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-orange-500/20 to-transparent"></div>
            
            <div className="relative p-8 md:p-12 lg:p-16">
              {/* Info Badge */}
              <div className="flex justify-center mb-8">
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 hover:border-yellow-500/30 transition-all duration-300 cursor-pointer group backdrop-blur-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                  </span>
                  <span className="text-sm text-white/70 group-hover:text-white">No Active Auction</span>
                  <button 
                    onClick={() => navigate("/admin/guide")}
                    className="flex items-center gap-1 text-sm font-semibold text-yellow-400 hover:text-yellow-300 transition-colors ml-2"
                  >
                    <span>Learn More</span>
                    <svg width="16" height="16" fill="none" className="group-hover:translate-x-1 transition-transform" stroke="currentColor">
                      <path
                        d="M3.959 9.5h11.083m0 0L9.501 3.958M15.042 9.5l-5.541 5.54"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Icon/Illustration */}
              <div className="flex justify-center mb-6">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-opacity animate-pulse"></div>
                  <div className="relative w-28 h-28 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl rotate-45 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <span className="-rotate-45 text-5xl filter drop-shadow-2xl">🏆</span>
                  </div>
                </div>
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-center mb-4 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80">
                  Create a New Auction
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400">
                  and Get Started 🚀
                </span>
              </h1>

              {/* Description */}
              <p className="text-sm md:text-base text-white/60 text-center max-w-2xl mx-auto mb-8 leading-relaxed">
                Auctions help you sell items to the highest bidder within a set time. 
                Set up your auction and let participants compete to determine the final price.
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
                <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-5 text-center hover:border-yellow-500/30 transition-all group">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">⏱️</div>
                  <div className="text-sm font-bold text-white mb-1">Set Time Limit</div>
                  <div className="text-xs text-white/50">Define auction duration</div>
                </div>
                <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-5 text-center hover:border-yellow-500/30 transition-all group">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">💰</div>
                  <div className="text-sm font-bold text-white mb-1">Starting Price</div>
                  <div className="text-xs text-white/50">Set base bid amount</div>
                </div>
                <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-5 text-center hover:border-yellow-500/30 transition-all group">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🏷️</div>
                  <div className="text-sm font-bold text-white mb-1">Add Items</div>
                  <div className="text-xs text-white/50">List auction items</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => navigate("/admin/guide")}
                  className="group px-8 py-3 bg-white/5 border-2 border-white/10 hover:border-yellow-500/30 text-white/80 hover:text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 backdrop-blur-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Guide
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full ml-1 border border-yellow-500/30">
                    PDF
                  </span>
                </button>

                <button
                  onClick={() => navigate("/admin/create-auction")}
                  className="group px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-slate-900 font-bold rounded-xl shadow-lg shadow-yellow-500/30 hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Auction
                </button>
              </div>

              {/* Quick Stats */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex flex-wrap justify-center gap-6 text-sm">
                  <span className="flex items-center gap-2 text-white/60">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    500+ Active Bidders
                  </span>
                  <span className="flex items-center gap-2 text-white/60">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    24/7 Support
                  </span>
                  <span className="flex items-center gap-2 text-white/60">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                    </span>
                    Secure Payments
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spotlight-move {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-spotlight-move {
          animation: spotlight-move 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AdminAuctionNotStart;