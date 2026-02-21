import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-amber-900/50 to-blue-900/50 backdrop-blur-sm z-50">
      <div className="relative">
        {/* Gavel animation */}
        <div className="flex flex-col items-center">
          <div className="relative animate-[gavelSwing_1.2s_ease-in-out_infinite] origin-top">
            {/* Handle */}
            <div className="w-3 h-24 bg-gradient-to-b from-amber-600 to-amber-800 rounded-t-lg rounded-b-sm mx-auto"></div>
            {/* Head */}
            <div className="w-20 h-10 bg-gradient-to-r from-amber-500 to-amber-700 rounded-lg mt-2 relative">
              {/* Metal bands */}
              <div className="absolute inset-x-2 top-1 h-1 bg-yellow-300 rounded-full"></div>
              <div className="absolute inset-x-2 bottom-1 h-1 bg-yellow-300 rounded-full"></div>
            </div>
          </div>
          {/* Block with impact animation */}
          <div className="w-28 h-8 bg-gradient-to-b from-amber-700 to-amber-900 rounded-lg mt-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent animate-[shine_1.5s_infinite]"></div>
          </div>
        </div>
        
        {/* Impact rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="absolute w-40 h-40 border-4 border-yellow-400/30 rounded-full animate-[ping_1.5s_ease-out_infinite]"></div>
          <div className="absolute w-60 h-60 border-4 border-yellow-400/20 rounded-full animate-[ping_1.5s_ease-out_0.3s_infinite]"></div>
          <div className="absolute w-80 h-80 border-4 border-yellow-400/10 rounded-full animate-[ping_1.5s_ease-out_0.6s_infinite]"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;