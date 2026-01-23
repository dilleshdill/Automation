import { React, useEffect, useState } from "react";
import { socket } from "../../Socket/socket";
import { useNavigate } from "react-router-dom";
import NavBar from "../../Components/Common/NavBar";
import Marquee from "react-fast-marquee";
import axios from "axios";
import { useLocation } from "react-router-dom";
import UserUpcomingPlayer from "../../Components/User/UserUpcomingPlayer";
import { toast } from "react-toastify";

const DOMAIN = import.meta.env.VITE_DOMAIN;

const UserAuctionScreen = () => {
  const navigate = useNavigate();
  const location = useLocation()

  const [player, setPlayer] = useState(null);
  const {data} = location.state || ""
  const {id,userId} = data
  const auctionId = id
  localStorage.setItem("auctionId",auctionId)
  const [currentBid, setCurrentBid] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isAuctionPaused, setAuctionPause] = useState(false);
  const [isAuctionStart,setAuctionStart] = useState(false)


  const fetchedData = async () => {
    
    try {
      const response = await axios.get(
        `${DOMAIN}/auction/auction-status?auctionId=${auctionId}`,
      );
      if (response.status === 200) {
        
        if (response.data.status === "live") {
          console.log(response.data.status);
          setAuctionPause(false);
          setAuctionStart(true)
        }
        if (response.data.status === "paused") {
          setAuctionPause(true);
        }
        if(response.data.status === "ended"){
          navigate("/user/auction/ended")
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchedData();

    socket.emit("join-auction", auctionId);
    
    socket.on("state-sync",({currentPlayer,currentBid,currentBidder,timeLeft,auctionStatus}) => {      
        console.log(auctionStatus,currentPlayer,currentBidder)
        setPlayer(currentPlayer)
        setCurrentBid(currentBid)
        setTimer(timeLeft)
        setAuctionStart(true)
    })

    socket.on("resume-auction",() => {
      setAuctionPause(false)
      setAuctionStart(true)
    })
    socket.on("auction-started", (auction) => {
      setPlayer(auction.currentPlayer);
      setAuctionStart(true)
      setAuctionPause(false)
    });

    socket.on("player-sold",({currentBidder,currentPlayer}) => {
          console.log(currentBidder,currentPlayer)
          toast.info(`${currentPlayer} Sold To ${currentBidder} Team`)
        })
    
    socket.on("player-unsold",({currentPlayer}) => {
          toast.error(`${currentPlayer} Unsold`)
        })


    socket.on("timer-update", (data) => setTimer(data.timeLeft));
    socket.on("bid-updated", (data) => setCurrentBid(data.bid));

    socket.on("new-player", (data) => {
      setPlayer(data.currentPlayer);
      setTimer(data.timeLeft);
      setCurrentBid(data.currentPlayer.basePrice);
    });

    socket.on("auction-paused", (time, currentBid, currentPlayer) => {
      setAuctionPause(true);
      console.log(time, currentBid, currentPlayer);
    });

    socket.on("auction-ended", () => navigate("/user/auction/ended"));

    return () => {
      socket.off("timer-update");
      socket.off("bid-updated");
      socket.off("new-player");
      socket.off("auction-stated");
      socket.off("player-sold");
      socket.off("player-unsold")
      socket.off("resume-auction")
      socket.off("state-sync")
    };
  }, []);

  const displayPlayer = player
  console.log(displayPlayer)

  return (
    <div className="min-h-screen min-w-screen bg-gray-100 flex flex-col items-center">
      <NavBar />

      {isAuctionPaused ? (
        <div className="flex flex-wrap items-center justify-center w-full py-2 font-medium text-sm text-white text-center bg-gradient-to-b from-orange-500 to-orange-600">
          <Marquee speed={50}>
            <p>🥤Drinks Break...! After Few Minutes Auction Will Resume</p>
            <a
              href="https://prebuiltui.com"
              className="flex items-center gap-1 px-3 py-1 text-xs rounded-md text-orange-600 bg-white hover:bg-slate-200 transition active:scale-95 ml-3"
            >
              Check it out
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.91797 7H11.0846"
                  stroke="#F54900"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 2.9165L11.0833 6.99984L7 11.0832"
                  stroke="#F54900"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </Marquee>
        </div>
      ) : (
        <div className="w-full py-2.5 font-medium text-sm text-green-800 text-center bg-gradient-to-r from-[#ABFF7E] to-[#9defdf]">
          <Marquee speed={100}>
            <p className="px-3 py-1 rounded-lg text-white bg-green-600 mr-2">
              Live Auction
            </p>
          </Marquee>
        </div>
      )}

      {(displayPlayer && isAuctionStart )? (
        <>
          <div className="bg-white shadow-lg rounded-xl overflow-hidden max-w-3xl w-full flex flex-col md:flex-row">
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

              <div className="grid grid-cols-2 gap-2 text-sm">
                <p>
                  <span className="font-medium">Matches:</span>{" "}
                  {displayPlayer.matches}
                </p>
                <p>
                  <span className="font-medium">Innings:</span>{" "}
                  {displayPlayer.innings}
                </p>
                <p>
                  <span className="font-medium">Runs:</span>{" "}
                  {displayPlayer.runs}
                </p>
                <p>
                  <span className="font-medium">Highest:</span>{" "}
                  {displayPlayer.highestScore}
                </p>
                <p>
                  <span className="font-medium">Average:</span>{" "}
                  {displayPlayer.average}
                </p>
                <p>
                  <span className="font-medium">Strike Rate:</span>{" "}
                  {displayPlayer.strikeRate}
                </p>
                <p>
                  <span className="font-medium">50s:</span>{" "}
                  {displayPlayer.fifties}
                </p>
                <p>
                  <span className="font-medium">100s:</span>{" "}
                  {displayPlayer.hundreds}
                </p>
              </div>
            </div>
          </div>

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
              <p className="text-xl font-bold text-blue-600">₹{currentBid}</p>
            </div>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-3xl font-bold mb-6 mt-6 tracking-wide">
            Welcome To The Live Auction{" "}
          </h2>
          <h2 className="text-1xl font-bold mb-6 mt-6 tracking-wide">
            Auction Will Be Start In Few Minutes
          </h2>
        </>
      )}

      <UserUpcomingPlayer auctionId = {auctionId} />
    </div>
  );
};

export default UserAuctionScreen;
