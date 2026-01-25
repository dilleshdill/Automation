import React from "react";
import { motion } from "framer-motion";

const BidderAuctionNotStart = () => {
  return (
    <div className=" flex flex-col items-center justify-center text-center px-4 py-10">
      
      {/* Info Badge */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className=" flex items-center gap-2 border border-slate-300 hover:border-slate-400/70 rounded-full w-max px-4 py-2 mt-20 md:mt-32 cursor-pointer bg-white/70 backdrop-blur-sm"
      >
        <span className="text-sm text-slate-700">Want More Information?</span>
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

      {/* Main Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="min-w-screen text-3xl md:text-6xl font-bold text-slate-800 mt-8 leading-tight max-w-4xl"
      >
        Auction Starts in a Few Minutes ⏳
      </motion.h2>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="min-w-screen text-sm md:text-lg text-slate-600 max-w-2xl mt-4 leading-relaxed px-2"
      >
        The auction will begin shortly. Stay connected and be prepared to bid.
        Competitive bidding will decide final prices based on real-time action.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="min-w-screen flex items-center justify-center gap-3 mt-6"
      >
        <button className="flex items-center gap-2 border border-slate-300 text-slate-700 hover:!bg-slate-100 rounded-full px-6 py-2 text-sm md:text-base transition font-medium">
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
        transition={{ delay: 0.5 }}
        className="min-w-screen text-xs text-slate-500 mt-4"
      >
        Waiting for admin to start the auction…
      </motion.div>
    </div>
  );
};

export default BidderAuctionNotStart;
