import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import NavBar from '../../Components/AdminComponent/AdminNavBar'

const BidderTeamPlayers = () => {
    const location = useLocation()
    const  Players = location.state || []
    
    
    return (
        <div className='flex min-w-screen flex-col min-h-screen'>     
            <NavBar />   
            {
                Players.map(player => (
                    <div className="p-4 bg-white border border-gray-200 hover:-translate-y-1 transition duration-300 rounded-lg shadow shadow-black/10 max-w-80">
                        <img className="rounded-md max-h-40 w-full object-cover" src="https://images.unsplash.com/photo-1560264418-c4445382edbc?q=80&w=400" alt="officeImage" />
                        <p className="text-gray-900 text-xl font-semibold ml-2 mt-4">
                            player
                        </p>
                        <p className="text-zinc-400 text-sm/6 mt-2 ml-2 mb-2">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore..
                        </p>
                        <button type="button" className="bg-indigo-600 hover:bg-indigo-700 transition cursor-pointer mt-4 mb-3 ml-2 px-6 py-2 font-medium rounded-md text-white text-sm">
                            Learn More
                        </button>
                    </div>
                ))
            }
        </div>
    
    )
}

export default BidderTeamPlayers