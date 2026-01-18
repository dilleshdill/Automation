import {React,lazy,Suspense} from 'react'
import './App.css'
import {BrowserRouter as Router,Routes,Route, BrowserRouter} from 'react-router-dom'

const LoginPage = lazy(() => import('./Pages/Common/LoginPage'))
const HomePage = lazy(()=> import('./Pages/Common/HomePage'))
const AdminPage = lazy(()=> import('./Pages/Admin/AdminPage'))
const AuctionCreate = lazy(()=> import('./Pages/Auction/AuctionCreate'))
const AcutionAdminPage = lazy(() => import('./Pages/Admin/AuctionAdminPage'))
const AuctionScreen = lazy(() => import("./Pages/Auction/AuctionScreen"))
const AuctionEnded = lazy(() => import("./Pages/Auction/AuctionEnded"))
const BidderAuctions = lazy(() => import("./Pages/Bidder/BidderAuctions"))
const BidderAuctionScreen = lazy(() => import("./Pages/Bidder/BidderAuctionScreen"))
const TeamsPage = lazy(() =>import("./Pages/Bidder/TeamsPage"))
const BidderTeamPlayers = lazy(() => import("./Pages/Bidder/BidderTeamPlayers"))
const PlayerDetailes  = lazy(() => import("./Pages/Player/PlayerDetailes") )
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Suspense>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={ <AdminPage />} />
          <Route path="/admin/create-auction" element={ <AuctionCreate />} />
          <Route path="/bidder/auctions" element={<BidderAuctions />} />
          <Route path="/bidder/auction/:id" element={<BidderAuctionScreen />} />
          <Route path="/auction/:id" element = {<AcutionAdminPage />} /> 
          <Route path="/auction/:id/live" element = {<AuctionScreen />} />
          <Route path="/auction/ended" element = {<AuctionEnded />} />
          <Route path="/auction/teams" element = {<TeamsPage />} />
          <Route path="/auction/teams/:id" element = {<BidderTeamPlayers />} />
          <Route path="/auction/teams/player/:id" element={<PlayerDetailes />} />
        </Routes>
      </Suspense> 
    </BrowserRouter>

  )
}

export default App