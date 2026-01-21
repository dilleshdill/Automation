import { React, useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../../Components/Common/NavBar.jsx';
import { useNavigate } from 'react-router-dom';
import BidderAuctionNotStart from '../../Components/BidderComponent/BidderAuctionNotStart.jsx';

const DOMAIN = import.meta.env.VITE_DOMAIN;

const UserAuctions = () => {
  const [auctionList, setAuctionList] = useState([]);
  const [selectedAuction, setSelectedAuction] = useState(null);

  const navigate = useNavigate();

    const fetchList = async () => {
      try {
        const response = await axios.get(DOMAIN + "/auction/get-auction-list", { withCredentials: true });
        if (response.status === 200) {
          setAuctionList(response.data.details);
        }
      } catch (err) {
        console.log(err);
      }
  };

  useEffect(() => {
    fetchList()

    const interval = setInterval(fetchList,5000)
    return () => clearInterval(interval)

  }, []);

  const getNavigate = (id) => {
    navigate(`/auction/${id}`,{ state: { id } });
  };

  const getLiveAuction = (id,e) => {
    e.stopPropagation();
    const userId = localStorage.getItem("userId")
    const data = {
      id,
      userId
    }
    
    navigate(`/user/auctions/${id}/live`,{
      state:{data}
    })
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <NavBar />

      {auctionList.length === 0 ? (
        <div className='flex flex-col'>
          <BidderAuctionNotStart />
        </div>
      ) : (
        <div className='m-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {auctionList.map((auction) => (
            <div
              key={auction._id}
              className="p-4 bg-white border border-gray-200 hover:-translate-y-1 transition duration-300 rounded-lg shadow shadow-black/10 max-w-80"
              onClick={() => getNavigate(auction._id)}
            >
              <img className="rounded-md max-h-40 w-full object-cover"
                src={auction.auction_img}
                alt="auctionImage"
              />

              <p className="text-gray-900 text-xl font-semibold ml-2 mt-4">{auction.auction_name}</p>
              <p className="text-zinc-500 text-sm ml-2 mt-2">{auction.description}</p>
              <p className="text-zinc-500 text-sm ml-2">Date: {auction.auction_date}</p>
              <p className="text-zinc-500 text-sm ml-2">Player Time: {auction.auction_time}</p>
              <button className='!bg-green-300 text-white mt-2 ml-2' onClick={(e)=> getLiveAuction(auction._id,e)}>
                View
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default UserAuctions;
