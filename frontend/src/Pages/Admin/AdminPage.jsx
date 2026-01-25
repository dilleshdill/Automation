import { React, useEffect, useState } from "react";
import AdminHomeNavBar from "../../Components/AdminComponent/AdminHomeNavBar.jsx";
import axios from "axios";
import AdminAuctionNotStart from "../../Components/AdminComponent/AdminAuctionNotStart.jsx";
import { useNavigate } from "react-router-dom";
import { socket } from "../../Socket/socket.js";
import Loader from "../../Loader/Loader.jsx";
import { toast } from "react-toastify";

const DOMAIN = import.meta.env.VITE_DOMAIN;

const AdminPage = () => {
  const [auctionList, setAuctionList] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showLoader, setLoader] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    try {
      const res = await axios.get(`${DOMAIN}/auction/get-auction-list`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setAuctionList(res?.data?.details ?? []);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getNavigate = (id) => {
    navigate(`/auction/${id}`, { state: { id } });
  };

  const startAuction = async (id) => {
    setLoader(true);
    socket.emit("join-auction", id);

    socket.off("auction-started");
    socket.once("auction-started", (auction) => {
      setLoader(false);
      navigate(`/auction/${auction?.auctionId}/live`, { state: { auction } });
    });

    try {
      await axios.post(
        `${DOMAIN}/auction/start-auction`,
        { auction_id: id },
        { withCredentials: true }
      );
    } catch (err) {
      setLoader(false);
      toast.error(err?.response?.data ?? "Something went wrong");
    }
  };

  const goToTheLiveAuction = (auction, e) => {
    e.stopPropagation();
    navigate(`/auction/${auction?._id}/live`, {
      state: {
        auction: {
          auctionId: auction?._id,
          currentPlayer: auction?.currentPlayer,
        },
      },
    });
  };

  const filteredAuctions = auctionList.filter((item) => {
    const matchesSearch = item?.auction_name
      ?.toLowerCase()
      ?.includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ? true : item?.status === filter;

    return matchesSearch && matchesFilter;
  });

  const badgeColor = {
    upcoming: "!bg-blue-100 text-blue-700 border-blue-300",
    live: "!bg-green-100 text-green-700 border-green-300",
    paused: "!bg-amber-100 text-amber-700 border-amber-300",
    ended: "!bg-red-200 text-red-700 border-red-300"
  };

  const buttonColor = {
    upcoming: "!bg-blue-600 hover:bg-blue-700",
    live: "!bg-green-600 hover:bg-green-700",
    paused: "!bg-green-600 hover:bg-green-700",
    ended: "!bg-slate-500 cursor-not-allowed"
  };

  return (
    <div className="min-w-screen min-h-screen flex flex-col bg-[#eef1f4]">
      <AdminHomeNavBar />
      {showLoader && <Loader />}

      {auctionList?.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <AdminAuctionNotStart />
        </div>
      ) : (
        <div className="px-6 py-10 max-w-7xl mx-auto space-y-6">

          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-semibold text-slate-700 tracking-tight">
              Active Auctions
            </h1>

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Search auctions..."
                className="px-3 py-2 rounded-md border border-slate-300 text-sm bg-white shadow-sm"
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className="px-3 py-2 rounded-md border border-slate-300 text-sm bg-white shadow-sm"
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="upcoming">Upcoming</option>
                <option value="live">Live</option>
                <option value="paused">Paused</option>
                <option value="ended">Ended</option>
              </select>
            </div>
          </div>

          {/* AUCTION GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredAuctions.map((auction) => {
              const status = auction?.status;
              return (
                <div
                  key={auction?._id}
                  onClick={() => getNavigate(auction?._id)}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-[2px] transition cursor-pointer p-4 flex flex-col"
                >
                  <img
                    src={auction?.auction_img}
                    alt="auction"
                    className="rounded-lg h-40 w-full object-cover mb-3"
                  />

                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-slate-800">
                      {auction?.auction_name}
                    </h2>

                    <span className={`text-xs px-2 py-[2px] rounded border ${badgeColor[status]}`}>
                      {status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                    {auction?.description}
                  </p>

                  <p className="text-xs text-slate-500 mt-3">
                    📅 Date: {auction?.auction_date}
                  </p>

                  <p className="text-xs text-slate-500">
                    ⏱ Player Time: {auction?.auction_time}
                  </p>

                  <div className="mt-auto pt-4">
                    {status === "upcoming" && (
                      <button
                        className={`w-full text-white text-sm py-2 rounded-md ${buttonColor[status]}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          startAuction(auction?._id);
                        }}
                      >
                        Start Auction
                      </button>
                    )}

                    {(status === "live" || status === "paused") && (
                      <button
                        className={`w-full text-white text-sm py-2 rounded-md ${buttonColor[status]}`}
                        onClick={(e) => goToTheLiveAuction(auction, e)}
                      >
                        Go to Live Auction
                      </button>
                    )}

                    {status === "ended" && (
                      <button
                        disabled
                        className="w-full bg-slate-400 text-white text-sm py-2 rounded-md"
                      >
                        Auction Ended
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
