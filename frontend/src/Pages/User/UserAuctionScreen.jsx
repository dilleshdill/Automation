import { React, useEffect, useState } from "react";
import { socket } from "../../Socket/socket";
import { useNavigate, useLocation } from "react-router-dom";
import NavBar from "../../Components/Common/NavBar";
import Marquee from "react-fast-marquee";
import axios from "axios";
import UserUpcomingPlayer from "../../Components/User/UserUpcomingPlayer";
import { toast } from "react-toastify";

const DOMAIN = import.meta.env.VITE_DOMAIN;

const UserAuctionScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [player, setPlayer] = useState(null);
  const { data } = location.state || "";
  const { id, userId } = data;
  const auctionId = id;

  const [currentBid, setCurrentBid] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isAuctionPaused, setAuctionPause] = useState(false);
  const [isAuctionStart, setAuctionStart] = useState(false);

  localStorage.setItem("auctionId", auctionId);

  const fetchedData = async () => {
    try {
      const response = await axios.get(
        `${DOMAIN}/auction/auction-status?auctionId=${auctionId}`
      );

      if (response.status === 200) {
        if (response.data.status === "live") {
          setAuctionStart(true);
          setAuctionPause(false);
        }
        if (response.data.status === "paused") {
          setAuctionPause(true);
        }
        if (response.data.status === "ended") {
          navigate("/user/auction/ended");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchedData();

    socket.emit("join-auction", auctionId);

    socket.on(
      "state-sync",
      ({ currentPlayer, currentBid, currentBidder, timeLeft }) => {
        setPlayer(currentPlayer);
        setCurrentBid(currentBid);
        setTimer(timeLeft);
      }
    );

    socket.on("resume-auction", () => {
      setAuctionPause(false);
      setAuctionStart(true);
    });

    socket.on("auction-started", (auction) => {
      setPlayer(auction.currentPlayer);
      setAuctionStart(true);
      setAuctionPause(false);
    });

    socket.on("player-sold", ({ currentBidder, currentPlayer }) => {
      toast.info(`${currentPlayer} Sold To ${currentBidder}`);
    });

    socket.on("player-unsold", ({ currentPlayer }) => {
      toast.error(`${currentPlayer} Unsold`);
    });

    socket.on("timer-update", (data) => setTimer(data.timeLeft));
    socket.on("bid-updated", (data) => setCurrentBid(data.bid));

    socket.on("new-player", (data) => {
      setPlayer(data.currentPlayer);
      setTimer(data.timeLeft);
      setCurrentBid(data.currentPlayer.basePrice);
    });

    socket.on("auction-paused", () => setAuctionPause(true));
    socket.on("auction-ended", () => navigate("/user/auction/ended"));

    return () => {
      socket.off("state-sync");
      socket.off("resume-auction");
      socket.off("timer-update");
      socket.off("bid-updated");
      socket.off("new-player");
      socket.off("auction-paused");
      socket.off("auction-ended");
      socket.off("player-sold");
      socket.off("player-unsold");
    };
  }, []);

  const displayPlayer = player;

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 flex flex-col items-center">
      <NavBar />

      {/* STATUS HEADER */}
      {isAuctionPaused ? (
        <div className="w-full py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600">
          <Marquee speed={60}>
            🥤 Drinks Break! Auction will resume shortly...
          </Marquee>
        </div>
      ) : (
        <div className="w-full py-2 text-sm font-medium bg-gradient-to-r from-green-500 to-green-700 text-white">
          <Marquee speed={120}>🔴 Live Auction</Marquee>
        </div>
      )}

      {/* PLAYER CARD */}
      {(displayPlayer && (isAuctionStart || isAuctionPaused)) ? (
        <>
          <div className="mt-6 bg-white rounded-xl shadow-xl max-w-3xl w-full flex flex-col md:flex-row overflow-hidden border border-gray-200">
            <div className="w-full md:w-1/3 p-4 flex justify-center">
              <img
                src={displayPlayer.imageUrl}
                alt="player"
                className="rounded-lg object-cover w-48 h-56 md:w-56 md:h-72 shadow-md"
              />
            </div>

            <div className="w-full md:w-2/3 p-5 flex flex-col">
              <h3 className="text-2xl font-semibold text-gray-800">
                {displayPlayer.name}
              </h3>
              <p className="text-gray-600 text-sm mb-3">{displayPlayer.role}</p>

              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                <p><span className="font-medium">Matches:</span> {displayPlayer.matches}</p>
                <p><span className="font-medium">Innings:</span> {displayPlayer.innings}</p>
                <p><span className="font-medium">Runs:</span> {displayPlayer.runs}</p>
                <p><span className="font-medium">Highest:</span> {displayPlayer.highestScore}</p>
                <p><span className="font-medium">Average:</span> {displayPlayer.average}</p>
                <p><span className="font-medium">Strike Rate:</span> {displayPlayer.strikeRate}</p>
                <p><span className="font-medium">50s:</span> {displayPlayer.fifties}</p>
                <p><span className="font-medium">100s:</span> {displayPlayer.hundreds}</p>
              </div>
            </div>
          </div>

          {/* TIMER + BID */}
          <div className="flex flex-wrap gap-6 mt-6 justify-center">
            <div className="bg-white shadow rounded-xl border border-gray-200 p-3 w-36 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Time Left
              </p>
              <p className="text-2xl font-bold text-red-600">{timer}s</p>
            </div>

            <div className="bg-white shadow rounded-xl border border-gray-200 p-3 w-36 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Current Bid
              </p>
              <p className="text-2xl font-bold text-blue-600">₹{currentBid}</p>
            </div>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-3xl font-bold mt-10 text-gray-800 tracking-wide">
            Welcome To The Live Auction
          </h2>
          <h2 className="text-md font-medium mt-3 text-gray-500">
            Auction will start shortly...
          </h2>
        </>
      )}

      <div className="mt-10 max-w-4xl w-full">
        <UserUpcomingPlayer auctionId={auctionId} />
      </div>
    </div>
  );
};

export default UserAuctionScreen;
