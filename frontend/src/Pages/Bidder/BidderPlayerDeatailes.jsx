import {React} from 'react'
import { useLocation } from 'react-router-dom'
import AuctionStart from '../../Components/Common/AuctionStart'
import BidderNavBar from '../../Components/BidderComponent/BidderNavBar'
const DOMAIN = import.meta.env.VITE_DOMAIN


const BidderPlayerDetailes = () => {
    const location = useLocation()

    return (
        <div>
            <BidderNavBar />
            <AuctionStart Player={location.state}/>
        </div>
    )
}

export default BidderPlayerDetailes
