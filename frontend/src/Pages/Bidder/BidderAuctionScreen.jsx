import { React, useEffect, useState } from "react";
import { socket } from "../../Socket/socket";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import BidderNavBar from "../../Components/BidderComponent/BidderNavBar";
import Marquee from "react-fast-marquee";
import axios from "axios";
import BidderUpcomingPlayer from "../../Components/BidderComponent/BidderUpcomingPlayer";
import BidderSoldPlayer from "./BidderSoldPlayer";

const DOMAIN = import.meta.env.VITE_DOMAIN;

const BidderAuctionScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { data } = location.state || {};
  const { id, teamName, teamId} = data ?? {};

  const auctionId = id;
  localStorage.setItem("auctionId", auctionId);

  const [player, setPlayer] = useState(null);
  const [isAuctionStart, setAuctionStart] = useState(false);

  const [currentBid, setCurrentBid] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isAuctionPaused, setAuctionPause] = useState(false);
  const [purse,setPurse] = useState(0)
  const [soldPlayer,setSoldPlayer] = useState([])

  const fetchedData = async () => {
    try {
      const response = await axios.get(
        `${DOMAIN}/auction/auction-status?auctionId=${auctionId}`,{
          withCredentials:true
        }
      );

      if (response.status === 200) {
        if (response.data.status === "live") {
          setAuctionPause(false);
          setAuctionStart(true);
        }
        if (response.data.status === "paused") {
          setAuctionPause(true);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getPurse = async() => {
    try{
      const response = await axios.get(`${DOMAIN}/bidder/getPurse?auctionId=${auctionId}`,
        {
        withCredentials:true
      })
      if(response.status === 200){
        console.log(response.data.data[0] )
        setPurse(response.data.data[0].purse)
        setSoldPlayer(response.data.data[0].players)
      }
    }catch(err){
      console.log(err)
    }
  }

  useEffect(() => {
    fetchedData();
    getPurse()

    socket.emit("franchise-join", {
      id,
      teamName,
    });

    socket.on(
      "state-sync",
      ({ currentPlayer, currentBid, currentBidder, timeLeft, auctionStatus }) => {
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
    });

    if (auctionId) {
      socket.emit("join-auction", auctionId);
    }

    socket.on("timer-update", (data) => setTimer(data.timeLeft));
    socket.on("bid-updated", (data) => setCurrentBid(data.bid));

    socket.on("new-player", (data) => {
      setPlayer(data.currentPlayer);
      setTimer(data.timeLeft);
      setCurrentBid(data.currentPlayer.basePrice);
    });

    socket.on("join-error", (msg) => {
      toast.error(msg);
      navigate("/bidder/auctions");
    });

    socket.on("join-success", (msg) => {
      localStorage.setItem("BidderId", teamId);
      toast.success("Welcome To The Auction");
    });

    socket.on("player-sold", ({ currentBidder, currentPlayer }) => {
      getPurse()
      toast.info(`${currentPlayer} Sold To ${currentBidder}`);
    });

    socket.on("player-unsold", ({ currentPlayer }) => {
      toast.error(`${currentPlayer} Unsold`);
    });

    socket.on("bid-error", (msg) => {
      toast.error(msg);
    });

    socket.on("auction-paused", (time, currentBid, currentPlayer) => {
      setAuctionPause(true);
    });

    socket.on("auction-ended", () => {
      navigate("/bidder/auction/ended");
    });

    return () => {
      socket.off("timer-update");
      socket.off("bid-updated");
      socket.off("new-player");
      socket.off("franchise-join");
      socket.off("join-error");
      socket.off("auction-started");
      socket.off("state-sync");
      socket.off("player-sold");
      socket.off("player-unsold");
    };
  }, []);

  

  const placeBid = () => {
    socket.emit("place-bid", {
      auctionId,
      bid: currentBid + 25000,
      teamName,
      teamId,
    });
  };

  const displayPlayer = player;

  return (
    <div className="min-h-screen min-w-screen !bg-[#eef1f4] flex flex-col items-center">
      <BidderNavBar />
      

      {isAuctionPaused ? (
        <div className="w-full py-2 font-medium text-sm bg-orange-600 text-white text-center">
          <Marquee speed={50}>🛑 Auction Paused (Drinks Break)</Marquee>
        </div>
      ) : (
        <div className="w-full py-2 font-medium text-sm bg-green-600 text-white text-center">
          <Marquee speed={100}>🏏 Live Auction</Marquee>
        </div>
      )}

      {displayPlayer && (isAuctionPaused || isAuctionStart) ? (
        <>
          {/* PLAYER CARD */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden max-w-3xl w-full flex flex-col md:flex-row mt-6">
            <div className="w-full md:w-1/3 p-3 flex justify-center items-center">
              <img
                src={displayPlayer.imageUrl}
                alt="player"
                className="rounded-lg object-cover w-48 h-56 md:w-56 md:h-72"
              />
            </div>

            <div className="w-full md:w-2/3 p-4">
              <h3 className="text-2xl font-semibold">{displayPlayer.name}</h3>
              <p className="text-gray-600 mb-3">{displayPlayer.role}</p>

              <div className="grid grid-cols-2 gap-2 text-sm text-slate-700">
                <p>Matches: {displayPlayer.matches}</p>
                <p>Innings: {displayPlayer.innings}</p>
                <p>Runs: {displayPlayer.runs}</p>
                <p>Highest: {displayPlayer.highestScore}</p>
                <p>Average: {displayPlayer.average}</p>
                <p>Strike Rate: {displayPlayer.strikeRate}</p>
                <p>50s: {displayPlayer.fifties}</p>
                <p>100s: {displayPlayer.hundreds}</p>
              </div>
            </div>
          </div>

          {/* BIDDING UI */}
          <div className="flex flex-wrap gap-6 mt-6 justify-center">
            <div className="bg-white shadow rounded-xl p-3 w-32 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Time Left
              </p>
              <p className="text-xl font-bold text-red-600">{timer}s</p>
            </div>

            <div className="bg-white shadow rounded-xl p-3 w-32 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Current Bid
              </p>
              <p className="text-xl font-bold text-blue-600">
                ₹{currentBid ?? 0}
              </p>
            </div>

            <div className="bg-white shadow rounded-xl p-3 w-32 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Purse
              </p>
              <p className="text-xl font-bold text-green-600">
                ₹{purse}
              </p>
            </div>
          </div>

          {!isAuctionPaused && (
            <button
              onClick={placeBid}
              className="mt-6 !bg-blue-600 hover:!bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition shadow"
            >
              Place Bid
            </button>
          )}

          <BidderUpcomingPlayer auctionId={auctionId} />
          <BidderSoldPlayer soldPlayer={soldPlayer} />
          
        </>
      ) : (
        <>
          <h2 className="text-3xl font-bold mt-10 tracking-wide">
            Welcome To The Live Auction
          </h2>
          <p className="text-slate-600">Auction will start shortly...</p>
        </>
        
      )}
      
    </div>
  );
};

export default BidderAuctionScreen;
