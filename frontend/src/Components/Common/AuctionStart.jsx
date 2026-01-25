import React from "react";

const AuctionStart = ({ Player }) => {
  const player = Player ?? {};

  return (
    <div className="min-w-screen min-h-screen bg-gray-50 px-4 py-8 flex justify-center items-start">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg border border-slate-200 p-6 md:p-8">
        
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Image */}
          <div className="md:w-1/3 w-full flex justify-center">
            <img
              src={player?.imageUrl ?? "/placeholder-player.png"}
              alt={player?.name ?? "Player"}
              className="w-72 h-80 object-cover rounded-lg shadow"
            />
          </div>

          {/* Info */}
          <div className="md:w-2/3 w-full min-w-screen">
            
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-semibold text-slate-800 capitalize">
                {player?.name ?? "Unknown Player"}
              </h1>

              {player?.role && (
                <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700 font-medium">
                  {player?.role}
                </span>
              )}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base md:text-lg">
              
              <Info label="Country" value={player?.country} />
              <Info label="Base Price" value={player?.basePrice} />
              <Info label="Status" value={player?.status} />
              <Info label="Sold Price" value={player?.soldPrice} />

              {/* Stats */}
              <Info label="Innings" value={player?.stats?.innings} />
              <Info label="Highest Score" value={player?.stats?.highestScore} />
              <Info label="Runs" value={player?.stats?.runs} />
              <Info label="Strike Rate" value={player?.stats?.strikeRate} />
              <Info label="Average" value={player?.stats?.average} />
              <Info label="50s" value={player?.stats?.fifties} />
              <Info label="100s" value={player?.stats?.hundreds} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
    <p className="font-medium text-slate-700">{label}</p>
    <p className="text-slate-600 font-normal">
      {value !== undefined && value !== null && value !== "" ? value : "—"}
    </p>
  </div>
);

export default AuctionStart;
  