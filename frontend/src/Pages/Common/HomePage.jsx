import {React,useEffect,useState} from 'react'
import NavBar from '../../Components/Common/NavBar.jsx'
import AuctionNotStart from '../../Components/Common/AuctionNotStart.jsx'
import AuctionStart from '../../Components/Common/AuctionStart.jsx'
const DOMAIN = import.meta.env.VITE_API_URL;


const HomePage = () => {
    const [status,setStatus] = useState("Started");
    useEffect(()=>{
        const fetchedData = async() => {
            try{
                const response = await fetch(DOMAIN + "/auction/status");
                if (response.status === 200) {
                    const data = response.data.status
                    setStatus(data);
                }

            }catch(err){
                console.log(err)
            }
        }
        fetchedData()
    },[])

  return (
    <div className='flex flex-col min-h-screen'>
      <NavBar />
        {status === "notStarted" && <AuctionNotStart /> }:
        {status === "Started" && <AuctionStart /> }
    </div>
  )
}

export default HomePage
