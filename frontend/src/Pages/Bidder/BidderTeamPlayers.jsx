import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BidderNavBar from "../../Components/BidderComponent/BidderNavBar";

const BidderTeamPlayers = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const Players = location.state || [];

  const handleNavigate = (id, setNo) => {
    navigate(`/auction/teams/player/${id}`, {
      state: { id, setNo },
    });
  };

  return (
    <div className="min-h-screen min-w-screen flex flex-col !bg-[#eef1f4]">
      <BidderNavBar />

      <div className="px-6 py-8 max-w-7xl w-full mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 text-center mb-6 tracking-tight">
          Purchased Players
        </h2>

        {Players?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
            {Players.map((player) => (
              <div
                key={player?.playerId}
                onClick={() => handleNavigate(player?.playerId, player?.setNo)}
                className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md 
                           hover:-translate-y-[2px] transition cursor-pointer overflow-hidden"
              >
                {/* IMAGE */}
                <img
                  src={player?.imageUrl}
                  alt={player?.name}
                  className="h-48 w-full object-cover"
                />

                <div className="p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-800 line-clamp-1">
                      {player?.name}
                    </h3>

                    {/* ROLE BADGE */}
                    <span className="text-xs px-2 py-[2px] rounded-full border !bg-slate-100 text-slate-600">
                      {player?.role}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">
                    Set No: <span className="font-medium text-slate-700">{player?.setNo}</span>
                  </p>

                  <p className="text-xs text-slate-500">
                    Sold Price:{" "}
                    <span className="font-semibold text-green-700">
                      ₹{player?.soldPrice?.toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center h-[40vh] opacity-80">
            <img
              src="https://cdn-icons-png.flaticon.com/512/7466/7466046.png"
              alt="empty"
              className="w-24 mb-3 opacity-80"
            />
            <p className="text-slate-600 text-lg font-medium">
              No players purchased yet!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BidderTeamPlayers;
