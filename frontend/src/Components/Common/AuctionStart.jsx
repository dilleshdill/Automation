import React from "react";

const AuctionStart = (props) => {
  const {Player} = props


  return (
      <div className="min-h-screen bg-gray-50 px-4 py-6">

        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-6">
          <div className="flex flex-col md:flex-row gap-8">

            <div className="md:w-1/3 w-full flex justify-center">
              <img
                src={Player.imageUrl}
                
                className="w-72 h-84 object-cover rounded-lg"
              />
            </div>

            <div className="md:w-2/3 w-full">
              <div className="flex items-center gap-4 mb-6">
                  <h1 className="text-2xl font-semibold text-gray-800">
                      {Player.name}
                  </h1>
                  <p className="text-gray-500 text-xl mt-5">
                      {Player.role}
                  </p>
              </div>


              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-lg">
                <Info label="Country" value={Player.country} />
                <Info label="Base Price" value={Player.basePrice} />
                <Info label="Status" value={Player.status} />
                <Info label="SoldPrice" value={Player.soldPrice} />
               
                {/* <Info label="Innings" value={Player.stats.innings} />
                <Info label="Highest Score" value={Player.stats.highestScore} />
                <Info label="Runs" value={Player.stats.runs} />
                <Info label="Strike Rate" value={Player.stats.strikeRate} />
                <Info label="Average" value={Player.stats.average} />
                <Info label="50s" value={Player.stats.fifties} />
                <Info label="100s" value={Player.stats.hundreds} /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

const Info = ({ label, value }) => (
  <div className="flex justify-between pb-2">
    <p className="font-medium text-gray-700">{label}</p>
    <p className="text-gray-500">{value}</p>
  </div>
);

export default AuctionStart;
