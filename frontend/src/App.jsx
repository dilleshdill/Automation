import {React,lazy,Suspense} from 'react'
import './App.css'
import {BrowserRouter as Router,Routes,Route, BrowserRouter} from 'react-router-dom'

const LoginPage = lazy(() => import('./Pages/LoginPage'))
const HomePage = lazy(()=> import('./Pages/HomePage'))
const AdminPage = lazy(()=> import('./Pages/AdminPage'))
const AuctionCreate = lazy(()=> import('./Pages/AuctionCreate'))
const AcutionAdminPage = lazy(() => import('./Pages/AuctionAdminPage'))
const AuctionScreen = lazy(() => import("./Pages/AuctionScreen"))
const AuctionEnded = lazy(() => import("./Pages/AuctionEnded"))
const BidderAuctions = lazy(() => import("./Pages/BidderAuctions"))
const BidderAuctionScreen = lazy(() => import("./Pages/BidderAuctionScreen"))
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
        </Routes>
      </Suspense> 
    </BrowserRouter>

  )
}

export default App