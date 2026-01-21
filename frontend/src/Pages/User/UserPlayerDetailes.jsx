import {React} from 'react'
import { useLocation } from 'react-router-dom'
import AuctionStart from '../../Components/Common/AuctionStart'
import NavBar from '../../Components/Common/NavBar'

const UserPlayerDetailes = () => {
    const location = useLocation()

    return (
        <div>
            <NavBar />
            <AuctionStart Player={location.state}/>
        </div>
    )
}

export default UserPlayerDetailes