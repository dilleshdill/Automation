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
    <div className="min-h-screen min-w-screen flex items-center justify-center bg-gradient-to-br from-[#e8ebf0] to-[#ffffff] px-4 py-10">

      <div className="backdrop-blur-xl !bg-white/30 border border-white/40 shadow-xl rounded-3xl px-10 py-14 flex flex-col items-center text-center max-w-md animate-fade-in">

        <h1 className="text-[80px] font-extrabold tracking-tight text-slate-800 drop-shadow-sm">
          404
        </h1>

        <h2 className="text-2xl font-semibold text-slate-700 mt-2">
          Page Not Found
        </h2>

        <p className="text-slate-500 mt-2 leading-relaxed text-sm">
          The page you’re trying to access doesn't exist or may have been moved.
        </p>

        <button
          onClick={getNavigate}
          className="mt-6 px-6 py-2 !bg-slate-800 text-white rounded-lg text-sm font-medium shadow hover:bg-slate-900 active:scale-95 transition-all"
        >
          Go Home
        </button>

        <p className="text-xs text-slate-400 mt-3">Error Code: 404</p>

      </div>
    </div>
  );
};

export default PageNotFound;
