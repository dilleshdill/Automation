import React from "react";

const AdminAuctionNotStart = () => {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
      
      {/* Badge */}
      <div className="group flex items-center gap-2 border border-slate-300 hover:border-slate-400 rounded-full px-5 py-2 transition duration-300 cursor-pointer">
        <span className="text-sm text-slate-600">Want More Information?</span>
        <button className="flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:text-blue-700">
          <span>Read More</span>
          <svg width="19" height="19" fill="none">
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

      {/* Main Heading */}
      <h1 className="text-3xl md:text-6xl font-bold mt-10 max-w-3xl leading-tight text-gray-800">
        Create a New Auction and Get Started 🚀
      </h1>

      {/* Sub text */}
      <p className="text-sm md:text-lg text-gray-600 mt-6 max-w-xl leading-relaxed">
        Auctions help you sell items to the highest bidder within a set time. 
        Set up your auction and let participants compete to determine the final price.
      </p>

      {/* Button Row */}
      <div className="flex items-center justify-center gap-3 mt-8">
        <button className="border border-slate-300 text-gray-700 hover:bg-slate-100 rounded-full px-6 py-3 text-sm md:text-base font-medium transition duration-300">
          Learn More
        </button>

        <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-3 text-sm md:text-base font-medium transition duration-300 shadow-md">
          Create Auction
        </button>
      </div>
    </div>
  );
};

export default AdminAuctionNotStart;
