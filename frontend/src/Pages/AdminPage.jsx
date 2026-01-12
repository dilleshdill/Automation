import {React,useEffect,useState} from 'react'
import NavBar from '../Components/AdminComponent/AdminNavBar.jsx'
const DOMAIN = import.meta.env.VITE_DOMAIN;
import axios from 'axios';
import AdminAuctionNotStart from '../Components/AdminComponent/AdminAuctionNotStart.jsx';
import { useNavigate } from 'react-router-dom';
import { socket } from '../Socket/socket.js';


const AdminPage = () => {
    const [auctionList,setAuctionList] = useState([]);   
    const navigate = useNavigate()
    
    useEffect(() => {
        
        fetchedList()
    }
    , []);

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

        socket.emit("join-auction", id);

        // Remove any older listeners
        socket.off("auction-started");

        // Attach listener BEFORE starting auction
        socket.once("auction-started", (auction) => {
            console.log("auction-started:", auction);

            navigate(`/auction/${auction.auctionId}/live`, {
            state: { auction }
            });
        });

        // Now make backend call
        try {
            await axios.post(DOMAIN + "/auction/start-auction",
            { auction_id: id },
            { withCredentials: true }
            );
        } catch (err) {
            console.log(err);
        }
    };


    return (
        <div className='flex flex-col min-h-screen'>
        <NavBar />
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
                            <img className="rounded-md max-h-40 w-full object-cover" src="https://images.unsplash.com/photo-1560264418-c4445382edbc?q=80&w=400" alt="officeImage" />
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
                                auction.status === "upcoming" ? 
                                <button type="button" className="!bg-gray-400 border-b-blue-400  transition cursor-pointer mt-4 mb-3 ml-2 px-6 py-2 font-medium rounded-md text-white text-sm" onClick={(e)=>{
                                    e.stopPropagation();
                                    startAuction(auction._id)}}>
                                    Start
                                </button>
                                :
                                <div>
                                    <button type="button" className="!bg-green-400 border-b-blue-400  transition cursor-pointer mt-4 mb-3 ml-2 px-6 py-2 font-medium rounded-md text-white text-sm" >
                                        Live
                                    </button>
                                    <button type="button" className="!bg-red-400 border-b-blue-400  transition cursor-pointer mt-4 mb-3 ml-2 px-6 py-2 font-medium rounded-md text-white text-sm" >
                                        Pause
                                    </button>
                                </div>
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
