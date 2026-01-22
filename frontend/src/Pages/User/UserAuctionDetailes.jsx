import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BidderHomeNavBar from "../../Components/BidderComponent/BidderHomeNavBar";

const DOMAIN = import.meta.env.VITE_DOMAIN;

const UserAuctionDeatailes = () => {
  const [auction, setAuction] = useState({});
  const location = useLocation();
  const { id } = location.state || {};


  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const response = await axios.post(
          DOMAIN + "/auction/get-auction",
          { auction_id: id },
          { withCredentials: true }
        );

        if (response.status === 200) {
           
          setAuction(response.data.existingAuction);
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (id) fetchAuction();
  }, [id]);

  
  
  return (
    <>
      <BidderHomeNavBar/>
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          
       
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

           
            <div className="flex justify-center items-start">
              <img
                src={auction.auction_img}
                alt={auction.auction_name}
                className="w-72 h-80 object-cover rounded-xl shadow-md"
              />
            </div>

            {/* DETAILS SECTION */}
            <div className="lg:col-span-1 flex flex-col">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">
                {auction.auction_name}
              </h1>

              <div className="space-y-4 text-lg">
                <Info label="Status" value={auction.status} />
                <Info label="Player Time (sec)" value={auction.auction_time} />
                <Info label="Short Name" value={auction.shorts} />
                <Info label="Description" value={auction.description} />
              </div>
            </div>

            
          </div>
        </div>

       

      </div>
    </>
  );
};

const Info = ({ label, value }) => (
  <div className="flex justify-between items-start pb-3">
    <p className="font-medium text-gray-700">{label}</p>
    <p className="text-gray-500 text-right max-w-xs">
      {value || "-"}
    </p>
  </div>
);



export default UserAuctionDeatailes;
