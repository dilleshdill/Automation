import React from 'react'
import AdminNavBar from '../../Components/AdminComponent/AdminNavBar.jsx'
import CreateAuction from '../../Components/AdminComponent/CreateAuction.jsx'

const AuctionCreate = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <AdminNavBar />
      <CreateAuction />
    </div>
  )
}

export default AuctionCreate
