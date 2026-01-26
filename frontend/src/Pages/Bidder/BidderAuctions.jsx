import { React, useEffect, useState, useMemo } from "react";
import BidderHomeNavBar from "../../Components/BidderComponent/BidderHomeNavBar.jsx";
import axios from "axios";
import BidderAuctionNotStart from "../../Components/BidderComponent/BidderAuctionNotStart.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const DOMAIN = import.meta.env.VITE_DOMAIN;

const BidderAuctions = () => {
  const [auctionList, setAuctionList] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null);

  const [teamName, setTeamName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bidderEmail, setBidderEmail] = useState("");
  const [loginId, setLoginId] = useState([]);
  const [loader, setLoader] = useState(false);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      const res = await axios.get(`${DOMAIN}/bidder/get-auction-list`, {
        withCredentials: true
      });
      if (res.status === 200) setAuctionList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchList();
    const interval = setInterval(fetchList, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      
      try {
        const res = await axios.get(`${DOMAIN}/bidder/checkAuth`, {
          withCredentials: true,
        });

        if (res.status === 200) {
          const email = res?.data?.data?.email;
          setBidderEmail(email);

          const loggedAuctions = auctionList
            .filter((a) => a?.franchises?.some((f) => f?.email === email))
            .map((a) => a._id);

          setLoginId(loggedAuctions);
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (auctionList.length > 0) checkAuth();
  }, [auctionList]);

  const filteredAuctions = useMemo(() => {
    return auctionList.filter((a) => {
      const matchSearch = a?.auction_name?.toLowerCase()?.includes(search.toLowerCase());
      const matchFilter = filterStatus === "all" || a?.status === filterStatus;
      return matchSearch && matchFilter;
    });
  }, [auctionList, search, filterStatus]);

  const getNavigate = (id) => {
    navigate(`/bidder/auctiondetailes/${id}`, { state: { id } });
  };

  const openLoginForm = (id, e) => {
    e.stopPropagation();
    setSelectedAuction(id);
    setShowLoginModal(true);
  };

  const submitLogin = async () => {
    setLoader(true);
    try {
      const res = await axios.post(
        `${DOMAIN}/bidder/verify`,
        { auction_id: selectedAuction, teamName, email, password },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setLoader(false);
        setShowLoginModal(false);
        navigate(`/bidder/auction/${selectedAuction}`, {
          state: { data: { id: selectedAuction, teamName, teamId: res?.data?.teamId } },
        });
      }
    } catch (err) {
      setLoader(false);
      setShowLoginModal(false);
      toast.error(err?.response?.data ?? "Invalid Credentials");
    }
  };

  const statusBadge = (status) =>
    ({
      upcoming: "!bg-blue-100 text-blue-700 border-blue-300",
      live: "!bg-green-100 text-green-700 border-green-300",
      paused: "!bg-amber-100 text-amber-700 border-amber-300",
      ended: "!bg-red-200 text-red-700 border-slate-300",
    }[status]);

  return (
    <div className="min-h-screen min-w-screen !bg-[#eef1f4] flex flex-col">
      <BidderHomeNavBar />

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

      {/* LIST */}
      {filteredAuctions.length === 0 ? (
        <div className="flex-1 flex justify-center items-center">
          <BidderAuctionNotStart />
        </div>
      ) : (
        <div className="px-6 py-10 max-w-7xl mx-auto w-full space-y-4">
          
          <h1 className="text-[24px] font-semibold text-slate-700 tracking-tight">
            Available Auctions
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredAuctions.map((auction) => (
              <div
                key={auction?._id}
                onClick={() => getNavigate(auction?._id)}
                className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer p-4 flex flex-col"
              >
                <img
                  src={auction?.auction_img}
                  alt="auction"
                  className="rounded-md h-40 w-full object-cover mb-3"
                />

                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-800">
                    {auction?.auction_name}
                  </h2>

                  <span className={`text-xs px-2 py-[2px] rounded border ${statusBadge(auction?.status)}`}>
                    {auction?.status?.charAt(0).toUpperCase() + auction?.status?.slice(1)}
                  </span>
                </div>

                <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                  {auction?.description}
                </p>

                <div className="mt-3 space-y-[2px] text-xs text-slate-500">
                  <p>📅 Date: {auction?.auction_date}</p>
                  <p>⏱ Player Time: {auction?.auction_time}s</p>
                </div>

                <div className="mt-auto pt-4">
                  {auction.status === "upcoming" && loginId.includes(auction?._id) && (
                    <button
                      onClick={(e) => openLoginForm(auction?._id, e)}
                      className="w-full !bg-blue-500 hover:!bg-blue-700 text-white text-sm py-2 rounded-md"
                    >
                      Login to Auction
                    </button>
                  )}

                  {(auction.status === "upcoming" && !loginId.includes(auction?._id)) && (
                    <button
                      onClick={(e) => openLoginForm(auction?._id, e)}
                      className="w-full !bg-slate-300 hover:!bg-red-700 text-white text-sm py-2 rounded-md"
                    >
                      You Dont Have Access
                    </button>
                  )}


                  {auction.status === "live" && loginId.includes(auction?._id) && (
                    <button
                      onClick={(e) => openLoginForm(auction?._id, e)}
                      className="w-full !bg-green-600 hover:!bg-green-700 text-white text-sm py-2 rounded-md"
                    >
                      Rejoin Auction
                    </button>
                  )}

                  {auction.status === "live" && !loginId.includes(auction?._id) && (
                    <button
                      onClick={(e) => openLoginForm(auction?._id, e)}
                      className="w-full !bg-slate-300 hover:!bg-red-700 text-white text-sm py-2 rounded-md"
                    >
                      You Dont Have Access
                    </button>
                  )}

                  {auction.status === "paused" && (
                    <button className="w-full !bg-green-500 text-white text-sm py-2 rounded-md opacity-90">
                      Auction Paused
                    </button>
                  )}

                  {auction.status === "ended" && (
                    <button className="w-full !bg-slate-400 text-white text-sm py-2 rounded-md opacity-90">
                      Auction Ended
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-3">
          <div className="bg-white w-full max-w-sm rounded-xl shadow-xl p-6">
            <h2 className="text-lg font-semibold mb-4 text-slate-800">
              Bidder Login
            </h2>

            <input
              className="border rounded w-full p-2 mb-3 text-sm"
              placeholder="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />

            <input
              type="email"
              className="border rounded w-full p-2 mb-3 text-sm"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              className="border rounded w-full p-2 mb-4 text-sm"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              className="w-full !bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:!bg-blue-700 mb-2"
              onClick={submitLogin}
            >
              {loader ? "Authenticating..." : "Login"}
            </button>

            <button
              className="w-full bg-gray-300 text-black py-2 rounded-md text-sm font-medium"
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
