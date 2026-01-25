import React from "react";
import toast from "react-hot-toast";

const BidderSoldPlayer = ({soldPlayer}) => {
  const soldPlayers = soldPlayer
  console.log(soldPlayers)
  toast.success("successfully enter into this ")

  return (
    <div className="w-full p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {soldPlayers.map((player) => (
        <div
          key={player._id}
          className="flex flex-col bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-all duration-200 border"
        >
          <img
            src={player.imageUrl}
            alt={player.name}
            className="w-full h-48 object-cover rounded-lg"
          />

          <div className="mt-3 flex flex-col gap-1">
            <h2 className="font-semibold text-lg">
              {player.name}{" "}
              <span className="text-sm text-gray-500">{player.role}</span>
            </h2>
            
            <p className="text-sm">
              <span className="font-medium">Status:</span>{" "}
              <span
                className="text-green-600 font-medium">
                Sold
              </span>
            </p>


            <p className="text-sm">
              <span className="font-medium">Sold Price:</span>{" "}
              {player.soldPrice ? `₹${player.soldPrice}` : "—"}
            </p>
          </div>

          
        </div>
      ))}
    </div>
  );
};

export default BidderSoldPlayer;
