import { useEffect, useState } from "react";
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
    socket.on("auction-started", (auction) => {
      console.log("auction started in adminPage")
      setLoader(false);
      navigate(`/auction/${auction?.auctionId}/live`, {
        state: { auction },
      });
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
    ended: "!bg-red-100 text-red-700 border-red-300",
  };

  const buttonColor = {
    upcoming: "!bg-blue-600 hover:bg-blue-700",
    live: "!bg-green-600 hover:bg-green-700",
    paused: "!bg-green-600 hover:bg-green-700",
    ended: "!bg-slate-400 cursor-not-allowed",
  };

  return (
    <div className="min-h-screen flex flex-col !bg-[#eef1f4]">
      <AdminHomeNavBar />
      {showLoader && <Loader />}

      {auctionList.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <AdminAuctionNotStart />
        </div>
      ) : (
        <div className="px-6 py-10 max-w-6xl mx-auto space-y-8">

          {/* HEADER */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <h1 className="text-3xl font-bold text-slate-700">
              Active Auctions
            </h1>

            <div className="flex w-full lg:w-auto gap-4">
              <input
                type="text"
                placeholder="Search auctions..."
                className="w-full lg:w-80 px-4 py-3 rounded-lg border border-slate-300 bg-white text-sm shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className="w-44 px-4 py-3 rounded-lg border border-slate-300 bg-white text-sm shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {filteredAuctions.map((auction) => {
              const status = auction?.status;

              return (
                <div
                  key={auction?._id}
                  onClick={() => getNavigate(auction?._id)}
                  className="bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition p-6 cursor-pointer flex flex-col"
                >
                  <img
                    src={auction?.auction_img}
                    alt="auction"
                    className="rounded-xl h-56 w-full object-cover mb-4"
                  />

                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-semibold text-slate-800">
                      {auction?.auction_name}
                    </h2>

                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full border ${badgeColor[status]}`}
                    >
                      {status?.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {auction?.description}
                  </p>

                  <div className="mt-4 space-y-1 text-sm text-slate-500">
                    <p>📅 Date: {auction?.auction_date}</p>
                    <p>⏱ Player Time: {auction?.auction_time}</p>
                  </div>

                  <div className="mt-auto pt-6">
                    {status === "upcoming" && (
                      <button
                        className={`w-full py-3 rounded-lg text-white text-sm font-semibold ${buttonColor[status]}`}
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
                        className={`w-full py-3 rounded-lg text-white text-sm font-semibold ${buttonColor[status]}`}
                        onClick={(e) => goToTheLiveAuction(auction, e)}
                      >
                        Go to Live Auction
                      </button>
                    )}

                    {status === "ended" && (
                      <button
                        disabled
                        className="w-full py-3 rounded-lg !bg-slate-400 text-white text-sm font-semibold"
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
