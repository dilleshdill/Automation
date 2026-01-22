import {React,useEffect,useState} from 'react'
import AdminHomeNavBar from '../../Components/AdminComponent/AdminHomeNavBar.jsx'
import axios from 'axios';
import AdminAuctionNotStart from '../../Components/AdminComponent/AdminAuctionNotStart.jsx';
import { useNavigate } from 'react-router-dom';
import { socket } from '../../Socket/socket.js';
import Loader from '../../Loader/Loader.jsx';
import { toast } from 'react-toastify';

const DOMAIN = import.meta.env.VITE_DOMAIN;

const AdminPage = () => {
    const [auctionList,setAuctionList] = useState([]);   
    const navigate = useNavigate()
    const [showLoader,setLoader] = useState(false)
    
    useEffect(() => {
        fetchedList()
    }, []);

    const fetchedList = async () => {
            try{
                const response = await axios.get(DOMAIN + "/auction/get-auction-list",
                    {withCredentials:true}
                );
                if (response.status === 200) {
                    console.log(response.data)
                    setAuctionList(response.data.details);
                    console.log(response.data);  
                }
            }catch(err){
                console.log(err)      
            }
    }

    const getNavigate = (id) => {
        navigate(`/auction/${id}`,{
            state: {id}
        })
    }

    const startAuction = async (id) => {
        setLoader(true)
        socket.emit("join-auction", id);

        socket.off("auction-started");

        socket.once("auction-started", (auction) => {
            console.log("auction-started:", auction);
            setLoader(false)
            navigate(`/auction/${auction.auctionId}/live`, {
            state: { auction }
            });
        });
        
        try {
            await axios.post(DOMAIN + "/auction/start-auction",
            { auction_id: id },
            { withCredentials: true }
            );
        } catch (err) {
            console.log(err)
            toast.error(err.response)
            
        }
    };

    const goToTheLiveAuction = (data,e) => {
        e.stopPropagation()
        const auction = {
            auctionId:data._id,
            currentPlayer:data.currentPlayer
        }
        navigate(`/auction/${data._id}/live`,
        {
            state:{auction}
        }
        )
    }


    return (
        <div className='flex flex-col min-h-screen'>
        <AdminHomeNavBar />
        {
            showLoader && <Loader />
        }
        {
            auctionList.length === 0 ?
            <div className='flex flex-col'>
                <AdminAuctionNotStart />
            </div>
            :
            <div className='m-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {
                    auctionList.map((auction) => (
                        <div className="p-4 bg-white border border-gray-200 hover:-translate-y-1 transition duration-300 rounded-lg shadow shadow-black/10 max-w-80" onClick={() =>{getNavigate(auction._id)}}>
                            <img className="rounded-md max-h-40 w-full object-cover" src={auction.auction_img} alt="officeImage" />
                            <p className="text-gray-900 text-xl font-semibold ml-2 mt-4">
                                {auction.auction_name}
                            </p>
                            <p className="text-zinc-500 text-sm/6 mt-2 ml-2 mb-2">
                                {auction.description}
                            </p>
                            <p className="text-zinc-500 text-sm/6 mt-2 ml-2 mb-2">
                                Date : {auction.auction_date}
                            </p>
                            <p className="text-zinc-500 text-sm/6 mt-2 ml-2 mb-2">
                                PlayerTime : {auction.auction_time}
                            </p>
                            {
                                auction.status === "upcoming" && 
                                <button type="button" className="!bg-gray-400 border-b-blue-400  transition cursor-pointer mt-4 mb-3 ml-2 px-6 py-2 font-medium rounded-md text-white text-sm" onClick={(e)=>{
                                    e.stopPropagation();
                                    startAuction(auction._id)}}>
                                    Start
                                </button>
                            }
                            {
                                (auction.status === "live" || auction.status === "paused") && 
                                <button type="button" className="!bg-green-400 border-b-blue-400  transition cursor-pointer mt-4 mb-3 ml-2 px-6 py-2 font-medium rounded-md text-white text-sm" 
                                    onClick={(e) => {
                                        goToTheLiveAuction(auction,e

                                        )
                                    }}>
                                        Go To The Live
                                </button>
                            }
                            {
                                auction.status === "ended" && 
                                <button type="button" className="!bg-red-400 border-b-blue-400  transition cursor-pointer mt-4 mb-3 ml-2 px-6 py-2 font-medium rounded-md text-white text-sm" 
                                >
                                        Auction Ended
                                </button>
                            }
                            
                            
                        </div>
                    ))
                }
            </div>

        }
        </div>
    )
}

export default AdminPage
