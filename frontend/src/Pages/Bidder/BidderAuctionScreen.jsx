import {React,useEffect, useState} from 'react'
import { socket } from '../../Socket/socket'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Navigate } from 'react-router-dom'
import BidderNavBar from '../../Components/BidderComponent/BidderNavBar'
import Marquee from "react-fast-marquee";
import axios from 'axios'

const DOMAIN = import.meta.env.VITE_DOMAIN

const BidderAuctionScreen = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const {data} = location.state || ""
    const {id,teamName,teamId} = data
    const [player,setPlayer] = useState(null)
    
    const [currentBid, setCurrentBid] = useState(0);
    const [timer, setTimer] = useState(0);
    const [isAuctionPaused,setAuctionPause] = useState(false)
    const auctionId = id 

    const fetchedData = async() => {
    
        try{
        const response = await axios.get(`${DOMAIN}/auction/auction-status?auctionId=${auctionId}`)
        if (response.status === 200){
            if (response.data.status === "upcoming"){
            setAuctionPause(false)
            
            }
            if (response.data.status === "paused"){
            setAuctionPause(true)
            
            }
        }
        }catch(err){
        console.log(err)
        }
    }
    
    useEffect(()=>{
        fetchedData()
        socket.emit("franchise-join", {
            id,
            teamName,
            
        });

        socket.on("resume-auction",() => {
            setAuctionPause(false)
        })

        socket.on("auction-started",auction => {
            setPlayer(auction.currentPlayer)
        })

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

        socket.on("join-error",msg => {
            toast.error(msg)
            navigate("/bidder/auctions")
        })

        socket.on("join-success",msg=>{
            console.log("Bidder Auction Screen JOin Success",msg)
            localStorage.setItem("BidderId",teamId)
            toast.success("Welcome To The Auction")
        })

        socket.on("bid-error",msg=>{
            toast.error(msg)
        })

        socket.on("auction-paused",(time,currentBid,currentPlayer) => {
              setAuctionPause(true)
              console.log(time,currentBid,currentPlayer)
        })

        
        socket.on("auction-ended", () => {
            navigate("/bidder/auction/ended")
        }
        );
        
        return () => {
              socket.off("timer-update");
              socket.off("bid-updated");
              socket.off("new-player");
              socket.off("join-error")
              socket.off("franchise-join")
              socket.off("auction-stated")
              socket.off("join-success")
            };
        }, []);

    const placeBid = () => {
        
        socket.emit("place-bid", {
          auctionId,
          bid: currentBid + 100000,
          teamName,
          teamId
        });
      };

    const displayPlayer = player;

    const dummyImg =
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTK38tEeJiYTWzabBXNBoRta9hhg6G8eZvEA&s";

    return (
        <div className="min-h-screen min-w-screen bg-gray-100 flex flex-col items-center">
        <BidderNavBar />
        {
            isAuctionPaused ?
            (
            
            <div className="flex flex-wrap items-center justify-center w-full py-2 font-medium text-sm text-white text-center bg-gradient-to-b from-orange-500 to-orange-600">
            <Marquee speed={50}>
            <p>🥤Drinks Break...! After Few Minutes Auction Will Resume</p>
            <a href="https://prebuiltui.com" className="flex items-center gap-1 px-3 py-1 text-xs rounded-md text-orange-600 bg-white hover:bg-slate-200 transition active:scale-95 ml-3">
                Check it out
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.91797 7H11.0846" stroke="#F54900" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 2.9165L11.0833 6.99984L7 11.0832" stroke="#F54900" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </a>
            </Marquee>
        </div>
            ):(
                <div className="w-full py-2.5 font-medium text-sm text-green-800 text-center bg-gradient-to-r from-[#ABFF7E] to-[#9defdf]">
                    <Marquee speed={100}>
                    <p className="px-3 py-1 rounded-lg text-white bg-green-600 mr-2">
                    Live Auction
                    </p>
                    </Marquee>
                </div>
            )
        }
        

        
        {displayPlayer ? (
        <>
            <div className="bg-white shadow-lg rounded-xl overflow-hidden max-w-3xl w-full flex flex-col md:flex-row">

            
            <div className="w-full md:w-1/3 p-3 flex justify-center items-center">
                <img
                src={dummyImg}
                alt="player"
                className="rounded-lg object-cover w-48 h-56 md:w-56 md:h-72"
                />
            </div>

            
            <div className="w-full md:w-2/3 p-4">
                <h3 className="text-2xl font-semibold">{displayPlayer.name}</h3>
                <p className="text-gray-600 mb-3">{displayPlayer.role}</p>

                
                <div className="grid grid-cols-2 gap-2 text-sm">
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

            <div className="flex flex-wrap gap-6 mt-6 justify-center">
            <div className="bg-white shadow rounded-xl p-3 w-32 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Time Left</p>
            <p className="text-xl font-bold text-red-600">{timer}s</p>
            </div>

            <div className="bg-white shadow rounded-xl p-3 w-32 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Current Bid</p>
            <p className="text-xl font-bold text-blue-600">₹{currentBid}</p>
            </div>
        </div>

        {
            !isAuctionPaused && <button
            onClick={placeBid}
            className="mt-6 !bg-blue-600 hover:!bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition shadow"
        >
            Place Bid
        </button>

        }
        </>
        ) : (
            <>
                <h2 className="text-3xl font-bold mb-6 mt-6 tracking-wide">Welcome To The Live Auction </h2>
                <h2 className="text-1xl font-bold mb-6 mt-6 tracking-wide">Auction Will Be Start In Few Minutes</h2>
            </>
        )}

        
        
        </div>
    );
}

export default BidderAuctionScreen
