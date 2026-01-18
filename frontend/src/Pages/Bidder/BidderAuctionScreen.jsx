import {React,useEffect, useState} from 'react'
import { socket } from '../../Socket/socket'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Navigate } from 'react-router-dom'

const BidderAuctionScreen = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const {data} = location.state || ""
    const {id,teamName,teamId} = data
    const [player,setPlayer] = useState(null)
    
    const [currentBid, setCurrentBid] = useState(0);
    const [timer, setTimer] = useState(0);
    const auctionId = id 
    
    useEffect(()=>{
        socket.emit("franchise-join", {
            id,
            teamName,
            
        });

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
            toast.success(msg)
        })

        socket.on("bid-error",msg=>{
            toast.error(msg)
        })

        
        socket.on("auction-ended", () => navigate("/auction/ended"));
        
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
        <div className="min-h-screen min-w-screen bg-gray-100 flex flex-col items-center p-4">

        <h2 className="text-3xl font-bold mb-6 tracking-wide">Live Auction</h2>

        
        {displayPlayer && (
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
        )}

        
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

        <button
            onClick={placeBid}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition shadow"
        >
            Place Bid
        </button>
        </div>
    );
}

export default BidderAuctionScreen
