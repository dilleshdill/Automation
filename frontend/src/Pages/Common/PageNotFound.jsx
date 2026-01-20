import React from "react";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  const getNavigate = () => {
    const role = localStorage.getItem("role")

    if (role === "user"){
        navigate("/user/auctions")
    }
    else if (role === "bidder"){
        navigate("/bidder/auctions")
    }
    else if(role === "admin"){
        navigate("/admin")
    }
  }

  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6">

      <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
      <p className="text-gray-500 mb-6">
        The page you are looking for doesn't exist or has been moved.
      </p>

      <button
        onClick={getNavigate}
        className="px-5 py-2 !bg-gray-600 text-white rounded-md hover:!bg-indigo-700 transition"
      >
        Go to Home
      </button>
      
    </div>
  );
};

export default PageNotFound;
