import {React,useEffect,useState} from 'react'
import NavBar from '../Components/AdminComponent/AdminNavBar.jsx'
import { toast } from 'react-toastify';
const DOMAIN = import.meta.env.VITE_API_URL;
import axios from 'axios';


const AdminPage = () => {
    const [auctionList,setAuctionList] = useState([]);    
    useEffect(() => {
        const fetchedList = async () => {
            try{
                const response = await axios.get(DOMAIN + "/admin/get-auction-list");
                if (response.status === 200) {
                    setAuctionList(response.data.auctions);
                    console.log(response.data);
                    toast.success("Fetched auction list successfully");
                }
            }catch(err){
                console.log(err)
                toast.error("Error in fetching data")
            }
        }
        fetchedList()
    }
    , []);
    return (
        <div className='flex flex-col min-h-screen'>
        <NavBar />
        {
            auctionList.length > 0 &&  
            <div className='mt-10 mx-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {
                    auctionList.map((auction) => (
                        <div key={auction._id} className="border border-gray-300 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
                            <h2 className="text-xl font-semibold mb-2">{auction.auctionName}</h2>
                            <p className="text-gray-600 mb-4">Auction ID: {auction._id}</p>
                            <p className="text-gray-600 mb-4">Auction Time: {auction.auctionTime} minutes</p>
                            <a href={`/admin/auction/${auction._id}`} className="text-indigo-600 hover:text-indigo-800 font-medium">

                                View Details
                            </a>
                        </div>
                    ))
                }
            </div>
        }
        {
            auctionList.length === 0 &&
            <div className='flex justify-center items-center mt-10 text-gray-600 font-medium'>
                No Auctions Created Yet.
            </div>
        }
        </div>
    )
}

export default AdminPage
