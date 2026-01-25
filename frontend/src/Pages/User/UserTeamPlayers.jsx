import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../../Components/Common/NavBar";

const UserTeamPlayers = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const Players = location.state || [];

  const handleNavigate = (id, setNo) => {
    navigate(`/auction/teams/player/${id}`, {
      state: { id, setNo },
    });
  };

  return (
    <div className="min-h-screen min-w-screen flex flex-col bg-[#eef1f4]">
      <NavBar />

      <div className="w-full px-5 mt-6 mb-4 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-800">
          Team Players
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          View purchased players & auction stats
        </p>
      </div>

      {Players.length > 0 ? (
        <div className="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto w-full">
          {Players.map((player) => (
            <div
              key={player.playerId}
              onClick={() => handleNavigate(player.playerId, player.setNo)}
              className="rounded-xl backdrop-blur-md bg-white/90 border border-white/40 shadow-md hover:shadow-xl hover:-translate-y-[3px] cursor-pointer overflow-hidden transition-all duration-300"
            >
              <img
                src={
                  player.imagePlayer ||
                  player.imageUrl ||
                  "/user-placeholder-player.png"
                }
                alt={player.name}
                className="w-full h-48 object-cover"
              />

              <div className="px-4 py-3 space-y-1">
                <h3 className="text-lg font-semibold text-slate-800">
                  {player.name}
                </h3>

                <p className="text-sm text-slate-500">
                  Set: <span className="font-medium text-slate-700">{player.setNo}</span>
                </p>

                <p className="text-sm text-slate-500">
                  Sold Price:{" "}
                  <span className="font-semibold text-green-600">
                    ₹{player.soldPrice?.toLocaleString()}
                  </span>
                </p>

                <button
                  className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.97] transition text-white text-sm font-medium py-2 rounded-md"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-slate-500 text-lg mt-10">
          No players bought yet!
        </p>
      )}
    </div>
  );
};

export default UserTeamPlayers;
