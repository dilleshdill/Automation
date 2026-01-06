import React from "react";

const AuctionStart = () => {
  

  const product = {
    name: "Virat Kohli",
    battingStyle: "Right Handed Batter",
    innings: 267,
    highest: 113,
    runs: 12345,
    average: 57.32,
    strikeRate: 93.25,
    fifties: 64,
    hundreds: 43,
    imageUrl:
      "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage.png",
  };


  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">

      {/* Player Card */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-6">
        <div className="flex flex-col md:flex-row gap-8">

          {/* Image */}
          <div className="md:w-1/3 w-full flex justify-center">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-72 h-84 object-cover rounded-lg"
            />
          </div>

          {/* Details */}
          <div className="md:w-2/3 w-full">
            <div className="flex items-center gap-4 mb-6">
                <h1 className="text-3xl font-semibold text-gray-800">
                    {product.name}
                </h1>
                <p className="text-gray-500 text-xl mt-5">
                    {product.battingStyle}
                </p>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-lg">
              <Info label="Innings" value={product.innings} />
              <Info label="Highest Score" value={product.highest} />
              <Info label="Runs" value={product.runs} />
              <Info label="Strike Rate" value={product.strikeRate} />
              <Info label="Average" value={product.average} />
              <Info label="50s" value={product.fifties} />
              <Info label="100s" value={product.hundreds} />
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
