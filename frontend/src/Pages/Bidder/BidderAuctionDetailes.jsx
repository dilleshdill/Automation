import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BidderHomeNavBar from "../../Components/BidderComponent/BidderHomeNavBar";

const DOMAIN = import.meta.env.VITE_DOMAIN;

const BidderAuctionDetailes = () => {
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
          setAuction(res.data?.existingAuction || {});
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (id) fetchAuction();
  }, [id]);

  const statusStyles = {
    upcoming: "!bg-blue-100 text-blue-700 border-blue-300",
    live: "!bg-green-100 text-green-700 border-green-300",
    paused: "!bg-amber-100 text-amber-700 border-amber-300",
    ended: "!bg-red-100 text-red-700 border-red-300",
  };

  return (
    <>
      <BidderHomeNavBar />

      <div className="min-h-screen w-full bg-gradient-to-br from-[#eef1f4] to-[#e2e6eb] px-6 py-10 flex justify-center">
        <div className="max-w-6xl w-full bg-white border border-slate-200 rounded-2xl shadow-xl p-10 relative">

          {/* HEADER SECTION */}
          <div className="flex items-center justify-between">
            <h1 className="text-[28px] font-bold text-slate-800 tracking-tight">
              {auction?.auction_name || "Auction Details"}
            </h1>

            {auction?.status && (
              <span
                className={`px-4 py-1.5 rounded-full text-[13px] font-semibold border capitalize ${statusStyles[auction.status]}`}
              >
                {auction.status}
              </span>
            )}
          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">

            {/* LEFT — IMAGE */}
            <div className="flex justify-center">
              <div className="rounded-xl overflow-hidden border border-slate-300 shadow-sm hover:shadow-md transition">
                <img
                  src={auction?.auction_img}
                  alt={auction?.auction_name}
                  className="w-72 h-80 object-cover"
                />
              </div>
            </div>

            {/* RIGHT — DETAILS */}
            <div className="lg:col-span-2 space-y-8">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Detail label="Short Name" value={auction?.shorts} />
                <Detail label="Player Time" value={auction?.auction_time + 's'} />
                <Detail label="Status" value={auction?.status} />
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-sm uppercase font-semibold text-slate-500 tracking-wide mb-1">
                  Description
                </h3>
                <p className="text-[15px] text-slate-700 leading-relaxed">
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
    <p className="text-[12px] uppercase font-semibold text-slate-500 tracking-wider">
      {label}
    </p>
    <p className="text-[16px] font-medium text-slate-800 mt-1">
      {value || "-"}
    </p>
  </div>
);

export default BidderAuctionDetailes;
