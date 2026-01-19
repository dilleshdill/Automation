import axios from 'axios'
import {React,useEffect, useState} from 'react'
import { useLocation } from 'react-router-dom'
import AuctionStart from '../../Components/Common/AuctionStart'
import AdminNavBar from '../../Components/AdminComponent/AdminNavBar'
const DOMAIN = import.meta.env.VITE_DOMAIN


const PlayerDetailes = () => {
    const location = useLocation()
    const data = location.state || ""
    const [Player,setPlayer] = useState({})

    const fetchedData = async() => {
        try{
            const auctionId = localStorage.getItem("auctionId")
            const response = await axios.post(`${DOMAIN}/player/get-player`,{
                id :data.id,
                setNo :data.setNo,
                auctionId,
            },
            {
                withCredentials:true
            })
            if (response.status === 200){
                
                setPlayer(response.data[0])
            }
        }catch(err){
            console.log(err)

        }
    }

    useEffect(() => {
        fetchedData()
    },[])

    return (
        <div>
            <AdminNavBar />
            <AuctionStart Player={Player}/>
        </div>
    )
}

export default PlayerDetailes
