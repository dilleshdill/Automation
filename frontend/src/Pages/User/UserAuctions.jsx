import { React, useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import UserHomeNavBar from '../../Components/User/UserHomeNavBar.jsx';
import { useNavigate } from 'react-router-dom';
import BidderAuctionNotStart from '../../Components/BidderComponent/BidderAuctionNotStart.jsx';

const DOMAIN = import.meta.env.VITE_DOMAIN;

const UserAuctions = () => {
  const [auctionList, setAuctionList] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      const response = await axios.get(DOMAIN + "/user/get-auction-list", { withCredentials: true });
      if (response.status === 200) 
        
        setAuctionList(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchList();
    const interval = setInterval(fetchList, 5000);
    return () => clearInterval(interval);
  }, []);

  const getNavigate = (id) => {
    navigate(`/user/auction/${id}`, { state: { id } });
  };

  const getLiveAuction = (id, e) => {
    e.stopPropagation();
    const userId = localStorage.getItem("userId");
    navigate(`/user/auctions/${id}/live`, {
      state: { data: { id, userId } }
    });
  };

  const filteredAuctions = useMemo(() => {
    return auctionList?.filter((a) => {
      const matchSearch = a?.auction_name?.toLowerCase()?.includes(search.toLowerCase());
      const matchFilter = filterStatus === "all" || a?.status === filterStatus;
      return matchSearch && matchFilter;
    });
  }, [auctionList, search, filterStatus]);

  const statusBadge = (status) =>
    ({
      upcoming: "!bg-blue-100 text-blue-700 border-blue-300",
      live: "!bg-green-100 text-green-700 border-green-300",
      paused: "!bg-yellow-100 text-yellow-700 border-yellow-300",
      ended: "!bg-red-200 text-red-700 border-red-300",
    }[status]);

  return (
    <div className='flex flex-col min-h-screen !bg-[#eef1f4]'>
      <UserHomeNavBar />

      {/* Search + Filter */}
      <div className="max-w-7xl mx-auto w-full px-6 mt-6 flex flex-wrap gap-3 items-center justify-between">
        <input
          placeholder="Search Auction..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-md w-full sm:w-[250px] bg-white shadow-sm text-sm outline-none"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border px-3 py-2 rounded-md bg-white shadow-sm text-sm cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="live">Live</option>
          <option value="paused">Paused</option>
          <option value="ended">Ended</option>
        </select>
      </div>

      {filteredAuctions?.length === 0 ? (
        <div className='flex flex-1 justify-center items-center'>
          <BidderAuctionNotStart />
        </div>
      ) : (
        <div className='px-6 py-10 max-w-7xl mx-auto w-full space-y-4'>
          <h1 className="text-[24px] font-semibold text-slate-700 tracking-tight">
            Available Auctions
          </h1>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7'>
            {filteredAuctions.map((auction) => (
              <div
                key={auction._id}
                onClick={() => getNavigate(auction._id)}
                className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer p-4 flex flex-col"
              >
                <img
                  className="rounded-md h-40 w-full object-cover mb-3"
                  src={auction.auction_img}
                  alt="auctionImage"
                />

                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-800">
                    {auction.auction_name}
                  </h2>

                  <span className={`text-xs px-2 py-[2px] rounded border ${statusBadge(auction.status)}`}>
                    {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
                  </span>
                </div>

                <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                  {auction.description}
                </p>

                <div className="mt-3 space-y-[2px] text-xs text-slate-500">
                  <p>📅 Date: {auction.auction_date}</p>
                  <p>⏱ Player Time: {auction.auction_time}s</p>
                </div>

                <div className="mt-auto pt-4">
                  {auction.status === "upcoming" && (
                    <button
                      onClick={(e) => getLiveAuction(auction._id, e)}
                      className="w-full !bg-blue-500 hover:!bg-blue-600 text-white text-sm py-2 rounded-md transition"
                    >
                      View
                    </button>
                  )}
                  {auction.status === "live" && (
                    <button
                      onClick={(e) => getLiveAuction(auction._id, e)}
                      className="w-full !bg-green-600 hover:!bg-green-700 text-white text-sm py-2 rounded-md transition"
                    >
                      Live
                    </button>
                  )}
                  {auction.status === "paused" && (
                    <button className="w-full !bg-yellow-500 text-white text-sm py-2 rounded-md opacity-90">
                      Paused
                    </button>
                  )}
                  {auction.status === "ended" && (
                    <button
                      onClick={(e) => getLiveAuction(auction._id, e)}
                      className="w-full !bg-slate-300 text-white text-sm py-2 rounded-md opacity-90"
                    >
                      Ended
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default UserAuctions;
