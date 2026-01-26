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
const BidderProfile = lazy(() =>import("./Pages/Bidder/BidderProfile"))
const UserAuction = lazy(() => import("./Pages/User/UserAuctions"))
const UserAuctionScreen = lazy(() => import("./Pages/User/UserAuctionScreen"))
const UserTeam = lazy(() =>import("./Pages/User/UserTeam"))
const AdminAuctionEnded = lazy(() => import("./Pages/Admin/AdminAuctionEnded"))
const UserAuctionEnded = lazy(() =>import("./Pages/User/UserAuctionEnded"))
const BidderAuctionEnded = lazy(() =>import("./Pages/Bidder/BidderAuctionEnded"))
const AdminProfile = lazy(() => import("./Pages/Admin/AdminProfile"))
const PageNotFound = lazy(() => import("./Pages/Common/PageNotFound"))
const AuctionPlayer = lazy(() =>import("./Pages/Auction/AuctionPlayer"))
const BidderPlayerDetailes = lazy(() =>import("./Pages/Bidder/BidderPlayerDeatailes") )
const UserPlayerDetailes = lazy(() =>import("./Pages/User/UserPlayerDetailes"))
const UserProfile = lazy(() => import("./Pages/User/UserProfile"))
const UserTeamPlayers = lazy(() =>import("./Pages/User/UserTeamPlayers"))
const BidderAuctionDetailes = lazy(() =>import("./Pages/Bidder/BidderAuctionDetailes"))
const UserAuctionDeatailes = lazy(() => import("./Pages/User/UserAuctionDetailes"))
const BidderHistory = lazy(() =>import("./Pages/Bidder/BidderHistory"))

import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Toaster />
      <Suspense>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path="/" element={<LoginPage />} />
          
          <Route path="/admin" element={ <AdminPage />} />
          <Route path="/admin/create-auction" element={ <AuctionCreate />} />
          <Route path="/admin/profile" element = {<AdminProfile />} />
          <Route path="/admin/auction/ended" element = {<AdminAuctionEnded />} />
          
          
          <Route path="/bidder/auctions" element={<BidderAuctions />} />
          <Route path="/bidder/auctiondetailes/:id" element={<BidderAuctionDetailes />} />
          <Route path="/bidder/auction/:id" element={<BidderAuctionScreen />} />
          <Route path="/bidder/profile" element={<BidderProfile />} />
          <Route path="/bidder/auction/ended" element={<BidderAuctionEnded />} />
          <Route path="/auction/bidder/player/:id" element={<BidderPlayerDetailes />} />
          <Route path="/bidder/history" element={<BidderHistory />} />
          

          <Route path="/auction/:id" element = {<AcutionAdminPage />} /> 
          <Route path="/auction/:id/live" element = {<AuctionScreen />} />  
          <Route path="/auction/teams" element = {<TeamsPage />} />
          <Route path="/auction/teams/:id" element = {<BidderTeamPlayers />} />
          <Route path="/auction/teams/player/:id" element={<PlayerDetailes />} />
          <Route path="/auction/player/:id" element = {<AuctionPlayer />} />


          <Route path="/user/auctions" element={<UserAuction />} /> 
          <Route path="/user/auction/:id" element={<UserAuctionDeatailes />} />
          <Route path="/user/auctions/:id/live" element={<UserAuctionScreen />} />
          <Route path="/user/auction/teams" element={<UserTeam />} />
          <Route path="/user/teams/player/:id" element={<UserTeamPlayers />} />
          <Route path="/user/auction/ended" element={<UserAuctionEnded />} />
          <Route path="/auction/user/player/:id" element={<UserPlayerDetailes />} />
          <Route path="/user/profile" element={<UserProfile />} />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense> 
    </BrowserRouter>

  )
}

export default App