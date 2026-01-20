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

  const dummyImg =
    "https://images.unsplash.com/photo-1560264418-c4445382edbc?q=80&w=400";

  return (
    <div className="min-h-screen min-w-screen flex flex-col !bg-gray-100">
      <BidderNavBar />

      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 text-center my-6">
        Team Players
      </h2>

      {Players.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-10 px-6 pb-10">
          {Players.map((player) => (
            <div
              key={player.playerId}
              onClick={() => handleNavigate(player.playerId, player.setNo)}
              className="cursor-pointer rounded-lg bg-white shadow hover:shadow-lg transition duration-300 hover:-translate-y-1 border border-gray-200"
            >
              <img
                src={dummyImg}
                alt="player"
                className="rounded-t-lg w-full h-48 object-cover"
              />

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {player.name}
                </h3>

                <p className="text-sm text-gray-600 mt-1">
                  Set: <span className="font-medium">{player.setNo}</span>
                </p>

                <p className="text-sm text-gray-600 mt-1">
                  Sold Price:{" "}
                  <span className="font-medium text-green-700">
                    ₹{player.soldPrice}
                  </span>
                </p>

                <button
                  className="mt-4 w-full !bg-gray-600 text-white py-2 rounded-md text-sm font-medium hover:!bg-indigo-700 transition"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg mt-10">
          No players bought yet!
        </p>
      )}
    </div>
  );
};

export default BidderTeamPlayers;
