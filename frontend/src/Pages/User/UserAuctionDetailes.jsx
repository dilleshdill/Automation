import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BidderHomeNavBar from "../../Components/BidderComponent/BidderHomeNavBar";

const DOMAIN = import.meta.env.VITE_DOMAIN;

const UserAuctionDetails = () => {
  const [auction, setAuction] = useState({});
  const location = useLocation();
  const { id } = location.state || {};

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const res = await axios.post(
          `${DOMAIN}/auction/get-auction`,
          { auction_id: id },
          { withCredentials: true }
        );
        if (res.status === 200) {
          setAuction(res.data.existingAuction);
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (id) fetchAuction();
  }, [id]);

  const statusColor = {
    upcoming: "!bg-blue-100 text-blue-700 border-blue-300",
    live: "!bg-green-100 text-green-700 border-green-300",
    paused: "!bg-amber-100 text-amber-700 border-amber-300",
    ended: "!bg-red-100 text-red-700 border-red-300",
  }[auction?.status];

  return (
    <>
      <BidderHomeNavBar />

      <div className="min-h-screen !bg-[#f5f6fa] px-6 py-10 flex justify-center">
        <div className="max-w-6xl w-full bg-white border border-slate-200 rounded-xl shadow p-8">

          {/* HEADER + STATUS */}
          <div className="flex flex-col md:flex-row items-start justify-between gap-3">
            <h1 className="text-[26px] font-semibold text-slate-800 tracking-tight">
              {auction?.auction_name || "Auction Details"}
            </h1>

            {auction?.status && (
              <span className={`px-4 py-[4px] rounded-full text-sm font-medium border ${statusColor}`}>
                {auction.status.toUpperCase()}
              </span>
            )}
          </div>

          {/* GRID CONTENT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">

            {/* AUCTION IMAGE */}
            <div className="flex justify-center">
              <img
                src={auction?.auction_img}
                alt={auction?.auction_name}
                className="w-72 h-80 object-cover rounded-xl shadow-md border border-slate-200"
              />
            </div>

            {/* INFO */}
            <div className="lg:col-span-2 space-y-5">

              <Detail label="Player Time" value={`${auction?.auction_time || "-"}s`} />
              <Detail label="Short Name" value={auction?.shorts} />
              <Detail label="Status" value={auction?.status} />

              <div>
                <p className="text-xs uppercase font-semibold text-slate-500 tracking-wider">
                  Description
                </p>
                <p className="text-[14px] text-slate-700 leading-relaxed mt-1">
                  {auction?.description || "No description provided."}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <p className="text-xs uppercase font-semibold text-slate-500 tracking-wider">
      {label}
    </p>
    <p className="text-[15px] font-medium text-slate-800">
      {value || "-"}
    </p>
  </div>
);

export default UserAuctionDetails;
