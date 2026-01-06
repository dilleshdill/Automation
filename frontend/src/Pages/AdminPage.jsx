import {React,useEffect,useState} from 'react'
import NavBar from '../Components/AdminComponent/AdminNavBar.jsx'
const DOMAIN = import.meta.env.VITE_DOMAIN;
import axios from 'axios';
import AdminAuctionNotStart from '../Components/AdminComponent/AdminAuctionNotStart.jsx';


const AdminPage = () => {
    const [auctionList,setAuctionList] = useState([]);    
    useEffect(() => {
        const fetchedList = async () => {
            try{
                const response = await axios.get(DOMAIN + "/admin/get-auction-list");
                if (response.status === 200) {
                    setAuctionList(response.data.auctions);
                    console.log(response.data);
                    
                }
            }catch(err){
                console.log(err)
                
            }
        }
        fetchedList()
    }
    , []);
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
                        <div key={auction.id} className='border border-gray-200 rounded-lg shadow-md p-4'>
                            <h2 className='text-xl font-bold mb-2 text-gray-700'>{auction.auction_name}</h2>
                            <p className='text-gray-600 mb-4'>{auction.description}</p>
                            <p className='text-gray-500 text-sm'>Date: {new Date(auction.auction_date).toLocaleDateString()}</p>
                        </div>
                    ))
                }
            </div>

        }
        </div>
    )
}

export default AdminPage
