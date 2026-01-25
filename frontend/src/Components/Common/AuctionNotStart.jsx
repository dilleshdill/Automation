import React from "react";
import { motion } from "framer-motion";

const AuctionNotStart = () => {
  return (
    <div className="min-w-screen min-h-[70vh] flex flex-col items-center justify-center px-4 py-10 text-center">
      
      {/* Info Badge */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex items-center gap-2 border border-slate-300 hover:border-slate-400/80 rounded-full w-max px-4 py-2 mt-24 md:mt-32 bg-white/70 backdrop-blur-sm cursor-pointer"
      >
        <span className="text-sm text-slate-700">To Know More Information</span>
        <button className="flex items-center gap-1 font-medium text-blue-600 hover:text-blue-700">
          <span className="text-sm">Read more</span>
          <svg
            width="19"
            height="19"
            viewBox="0 0 19 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
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
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.35 }}
        className="min-w-screen text-3xl md:text-6xl font-semibold text-slate-800 mt-8 leading-tight max-w-3xl"
      >
        Auction Will Start in a Few Minutes ⏳
      </motion.h2>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35 }}
        className="min-w-screen text-sm md:text-lg text-slate-600 max-w-2xl mt-4 px-2 leading-relaxed"
      >
        Auctions determine the final price through competitive bidding among
        participants within a limited time window. Stay prepared for the action.
      </motion.p>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, duration: 0.35 }}
        className="min-w-screen flex items-center justify-center gap-3 mt-6"
      >
        <button className="flex items-center gap-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-full px-6 py-3 text-sm md:text-base transition font-medium">
          Learn More
          <svg
            width="6"
            height="8"
            viewBox="0 0 6 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.25.5 4.75 4l-3.5 3.5"
              stroke="#050040"
              strokeOpacity=".4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </motion.div>

      {/* Status Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ delay: 0.4 }}
        className="min-w-screen text-xs text-slate-500 mt-4"
      >
        Waiting for the auction to begin…
      </motion.div>
    </div>
  );
};

export default AuctionNotStart;
