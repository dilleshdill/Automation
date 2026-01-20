import {React,useEffect, useState} from 'react'
import BidderNavBar from '../../Components/BidderComponent/BidderNavBar'
import axios from 'axios'
const DOMAIN = import.meta.env.VITE_DOMAIN


const BidderProfile = () => {
  const [BidderData,setBidderData] = useState({})

  const fetchedData = async() => {
    try{
      const id = localStorage.getItem("BidderId")
      const auctionId = localStorage.getItem("auctionId")
      const response = await axios.post(DOMAIN + "/bidder/get-bidder",
        {
          id,
          auctionId
        },
        {withCredentials:true})
      
      if (response.status === 200){
        console.log(response.data)
        setBidderData(response.data)
      } 

    }catch(err){
      console.log(err)
    }
  }
  
  useEffect(() => {
    fetchedData()
  },[])
  return (
    <div className='flex flex-col min-w-screen min-h-screen'>
      <BidderNavBar />
      <div className="flex flex-col max-md:gap-20 md:flex-row pb-20 items-center justify-between mt-20 px-4 md:px-16 lg:px-24 xl:px-32">
        <div className="flex flex-col items-center md:items-start">
            <div className="flex flex-wrap items-center justify-center p-1.5 rounded-full border border-slate-600 text-black text-xs">
            <div className="flex items-center">
                    <img className="size-7 rounded-full border-3 !border-white"
                        src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50" alt="userImage1"/>
                    <img className="size-7 rounded-full border-3 border-white -translate-x-2"
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50" alt="userImage2" />
                    <img className="size-7 rounded-full border-3 border-white -translate-x-4"
                        src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=50&h=50&auto=format&fit=crop"
                        alt="userImage3" />
                </div>
                <p className="-translate-x-2">Support Our Franchsis To Win </p>
            </div>
            <h1 className="text-center md:text-left text-5xl leading-[68px] md:text-6xl md:leading-[84px] font-medium max-w-xl text-slate-500">
                {BidderData.teamName}
            </h1>
            <p className="text-center md:text-left text-sm text-slate-400 max-w-lg mt-2">
                Email : {BidderData.email}
            </p>
            <p className="text-center md:text-left text-sm text-slate-400 max-w-lg mt-2">
                Purse : {BidderData.purse}
            </p>
            <div className="flex items-center gap-4 mt-8 text-sm">
              
            </div>
        </div>
          
        <img src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/hero-section-showcase-3.png" alt="hero" className="max-w-xs sm:max-w-sm lg:max-w-md transition-all duration-300" />
      </div >
    </div>
  )
}

export default BidderProfile
