import { React, useEffect, useState } from 'react';
import BidderNavBar from '../../Components/BidderComponent/BidderNavBar.jsx';
const DOMAIN = import.meta.env.VITE_DOMAIN;
import axios from 'axios';
import BidderAuctionNotStart from '../../Components/BidderComponent/BidderAuctionNotStart.jsx';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const BidderAuctions = () => {
  const [auctionList, setAuctionList] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null);

  const [teamName, setTeamName] = useState("CSK");
  const [email, setEmail] = useState("attitudedillesh@gmail.com");
  const [password, setPassword] = useState("123");

  const navigate = useNavigate();

  useEffect(() => {
  fetchList(); 

  const interval = setInterval(fetchList, 5000);
  return () => clearInterval(interval);
}, []);


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

  const getNavigate = (id) => {
    navigate(`/auction/${id}`,{ state: { id } });
  };

  const openLoginForm = (id, e) => {
    e.stopPropagation();
    setSelectedAuction(id);
    setShowLoginModal(true);
  };

  const submitLogin = async () => {
    try {
      const response = await axios.post(
        DOMAIN + "/bidder/verify",
        { auction_id: selectedAuction, teamName, email, password },
        { withCredentials: true }
      );
      console.log(response.data)
      if (response.status === 200) {
        const data = {
          id:selectedAuction,
          teamName,
          teamId:response.data.teamId
        }
        setShowLoginModal(false);
        navigate(`/bidder/auction/${selectedAuction}`,{
          state:
          { 
            data
          }}
        );
      }
    } catch (err) {
      setShowLoginModal(false)
      console.log(err)
      toast.error(err.response.data)
      
    }
  };

  return (
    <div className='flex flex-col min-h-screen'>
      <BidderNavBar />

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

              {auction.status === "upcoming" ? (
                <button
                  type="button"
                  className="!bg-gray-400 transition cursor-pointer mt-4 mb-3 ml-2 px-6 py-2 font-medium rounded-md text-white text-sm"
                  onClick={(e) => openLoginForm(auction._id, e)}
                >
                  Login
                </button>
              ) : (
                <div>
                  <button className="!bg-green-400 mt-4 mb-3 ml-2 px-6 py-2 rounded-md text-white text-sm" >
                    Go To The Live Auction
                  </button>
                  
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-80">
            <h2 className="text-lg font-semibold mb-4">Bidder Login</h2>

            <input
              type="text"
              placeholder="Team Name"
              className="border rounded w-full p-2 mb-3"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email"
              className="border rounded w-full p-2 mb-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="border rounded w-full p-2 mb-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              className="!bg-gray-600 text-white px-4 py-2 rounded w-full mb-2"
              onClick={submitLogin}
            >
              Submit
            </button>

            <button
              className="bg-gray-300 text-black px-4 py-2 rounded w-full"
              onClick={() => setShowLoginModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BidderAuctions;
