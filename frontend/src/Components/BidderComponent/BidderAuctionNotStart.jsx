import React from "react";
import { motion } from "framer-motion";

const BidderAuctionNotStart = () => {
  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-r from-slate-600 via-slate-200 to-slate-600">
      {/* Optional: Add BidderHomeNavBar if needed */}
      {/* <BidderHomeNavBar /> */}

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative max-w-4xl w-full">
          {/* Decorative glass blurs */}
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-white/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-white/30 rounded-full blur-3xl"></div>
          
          {/* Main Glass Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative backdrop-blur-md bg-white/20 rounded-3xl shadow-2xl border border-white/30 overflow-hidden"
          >
            {/* Top gradient bar */}
            <div className="h-2 bg-gradient-to-r from-slate-600/80 via-slate-500/80 to-slate-600/80"></div>
            
            <div className="p-8 md:p-12 lg:p-16">
              {/* Info Badge */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex justify-center mb-8"
              >
                <div className="inline-flex items-center gap-2 backdrop-blur-sm bg-white/30 border border-white/40 rounded-full px-4 py-2 hover:bg-white/40 transition-all duration-300 cursor-pointer group">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                  <span className="text-sm text-slate-700 group-hover:text-slate-800">Countdown Begins</span>
                  <button className="flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors ml-2">
                    <span>Read more</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 19 19"
                      fill="none"
                      className="group-hover:translate-x-1 transition-transform"
                    >
                      <path
                        d="M3.959 9.5h11.083m0 0L9.501 3.958M15.042 9.5l-5.541 5.54"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </motion.div>

              {/* Timer Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/40 rounded-full blur-2xl animate-pulse"></div>
                  <div className="relative w-24 h-24 backdrop-blur-sm bg-white/30 rounded-2xl rotate-45 flex items-center justify-center shadow-xl border border-white/40">
                    <span className="-rotate-45 text-4xl">⏳</span>
                  </div>
                </div>
              </div>

              {/* Main Heading */}
              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="text-3xl md:text-5xl lg:text-6xl font-bold text-center text-slate-800 mb-4 leading-tight"
              >
                Auction Starts in
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-500">
                  a Few Minutes ⏳
                </span>
              </motion.h2>

              {/* Description with glass background */}
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-sm md:text-base text-slate-700 text-center max-w-2xl mx-auto mb-8 leading-relaxed backdrop-blur-sm bg-white/10 rounded-xl p-4 border border-white/20"
              >
                The auction will begin shortly. Stay connected and be prepared to bid.
                Competitive bidding will decide final prices based on real-time action.
              </motion.p>

              {/* Countdown Placeholder */}
              <div className="flex justify-center mb-8">
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { value: "05", label: "Minutes" },
                    { value: "30", label: "Seconds" }
                  ].map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="backdrop-blur-sm bg-white/30 rounded-xl px-4 py-3 border border-white/40 min-w-[80px]">
                        <div className="text-3xl font-bold text-slate-800">{item.value}</div>
                      </div>
                      <div className="text-xs text-slate-600 mt-2">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <button className="group px-8 py-3 backdrop-blur-sm bg-white/30 border-2 border-white/40 hover:bg-white/40 text-slate-700 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Learn More
                </button>

                <button className="group px-8 py-3 backdrop-blur-sm bg-gradient-to-r from-slate-600/80 to-slate-500/80 hover:from-slate-700/80 hover:to-slate-600/80 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 border border-white/30">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Watch Live
                </button>
              </motion.div>

              {/* Status Footer with glass effect */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 pt-6 border-t border-white/30"
              >
                <div className="flex justify-center">
                  <div className="backdrop-blur-sm bg-white/20 rounded-full px-4 py-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                    <span className="text-xs text-slate-600">
                      Waiting for admin to start the auction…
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Quick Tips */}
              <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs">
                <span className="backdrop-blur-sm bg-white/20 px-3 py-1 rounded-full text-slate-600">
                  ⚡ Be Ready
                </span>
                <span className="backdrop-blur-sm bg-white/20 px-3 py-1 rounded-full text-slate-600">
                  💰 Check Purse
                </span>
                <span className="backdrop-blur-sm bg-white/20 px-3 py-1 rounded-full text-slate-600">
                  🎯 Set Strategy
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BidderAuctionNotStart;