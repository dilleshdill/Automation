import React from 'react'
import {useLocation } from 'react-router-dom'
import AuctionStart from '../../Components/Common/AuctionStart'
import BidderNavBar from '../../Components/BidderComponent/BidderNavBar'

const AuctionPlayer = () => {
    const location = useLocation()
    
    return (
        <div>
            <BidderNavBar />
            <AuctionStart Player={location.state}/>
        </div>
    )
}

export default AuctionPlayer
