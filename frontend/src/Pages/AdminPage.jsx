import {React,useEffect,useState} from 'react'
import NavBar from '../Components/AdminComponent/AdminNavBar.jsx'
import { toast } from 'react-toastify';
const DOMAIN = import.meta.env.VITE_API_URL;
import axios from 'axios';


const AdminPage = () => {
    const [auctionList,setAuctionList] = useState([]);    
    // useEffect(() => {
    //     const fetchedList = async () => {
    //         try{
    //             const response = await axios.get(DOMAIN + "/admin/get-auction-list");
    //             if (response.status === 200) {
    //                 setAuctionList(response.data.auctions);
    //                 console.log(response.data);
    //                 toast.success("Fetched auction list successfully");
    //             }
    //         }catch(err){
    //             console.log(err)
    //             toast.error("Error in fetching data")
    //         }
    //     }
    //     fetchedList()
    // }
    // , []);
    return (
        <div className='flex flex-col min-h-screen'>
        <NavBar />
        
        </div>
    )
}

export default AdminPage
