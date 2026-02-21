import React from "react";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  const getNavigate = () => {
    const role = localStorage.getItem("role");

    if (role === "user") navigate("/user/auctions");
    else if (role === "bidder") navigate("/bidder/auctions");
    else if (role === "admin") navigate("/admin");
    else navigate("/login"); // fallback
  };

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4 py-10 relative overflow-hidden">
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main Glass Card */}
      <div 
        className="relative backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl px-10 py-14 flex flex-col items-center text-center max-w-md w-full animate-fade-in"
        style={{
          animation: 'fadeIn 0.6s ease-out, float 6s ease-in-out infinite'
        }}
      >

        {/* Decorative 404 with glow */}
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full"></div>
          <h1 className="relative text-[100px] font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 drop-shadow-2xl">
            404
          </h1>
        </div>

        {/* Icon */}
        <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-white mb-2">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-slate-300 mt-2 leading-relaxed text-sm max-w-sm">
          The page you're trying to access doesn't exist or may have been moved to another location.
        </p>

        {/* Home Button */}
        <button
          onClick={getNavigate}
          className="group relative mt-8 px-8 py-3 bg-white/20 hover:bg-white/30 text-black font-medium rounded-xl backdrop-blur-sm border border-white/20 hover:border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
          <span className="relative flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Return Home
          </span>
        </button>

        {/* Error Code */}
        <div className="mt-6 flex items-center gap-2">
          <div className="w-1 h-1 bg-white/30 rounded-full"></div>
          <p className="text-xs text-slate-400">Error Code: 404</p>
          <div className="w-1 h-1 bg-white/30 rounded-full"></div>
        </div>

        {/* Decorative dots */}
        <div className="absolute bottom-4 left-4 flex gap-1">
          <div className="w-1 h-1 bg-white/20 rounded-full"></div>
          <div className="w-1 h-1 bg-white/20 rounded-full"></div>
          <div className="w-1 h-1 bg-white/20 rounded-full"></div>
        </div>
        <div className="absolute top-4 right-4 flex gap-1">
          <div className="w-1 h-1 bg-white/20 rounded-full"></div>
          <div className="w-1 h-1 bg-white/20 rounded-full"></div>
          <div className="w-1 h-1 bg-white/20 rounded-full"></div>
        </div>
      </div>

      {/* Add keyframe animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PageNotFound;