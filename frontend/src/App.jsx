import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";

/* ===== Lazy Imports ===== */
const LoginPage = lazy(() => import("./Pages/Common/LoginPage"));
const HomePage = lazy(() => import("./Pages/Common/HomePage"));
const AdminPage = lazy(() => import("./Pages/Admin/AdminPage"));
const AuctionCreate = lazy(() => import("./Pages/Auction/AuctionCreate"));
const AcutionAdminPage = lazy(() => import("./Pages/Admin/AuctionAdminPage"));
const AuctionScreen = lazy(() => import("./Pages/Auction/AuctionScreen"));
const AuctionEnded = lazy(() => import("./Pages/Auction/AuctionEnded"));

const BidderAuctions = lazy(() => import("./Pages/Bidder/BidderAuctions"));
const BidderAuctionScreen = lazy(() => import("./Pages/Bidder/BidderAuctionScreen"));
const TeamsPage = lazy(() => import("./Pages/Bidder/TeamsPage"));
const BidderTeamPlayers = lazy(() => import("./Pages/Bidder/BidderTeamPlayers"));
const PlayerDetailes = lazy(() => import("./Pages/Player/PlayerDetailes"));
const BidderProfile = lazy(() => import("./Pages/Bidder/BidderProfile"));
const BidderAuctionEnded = lazy(() => import("./Pages/Bidder/BidderAuctionEnded"));
const BidderHistory = lazy(() => import("./Pages/Bidder/BidderHistory"));
const BidderAuctionDetailes = lazy(() => import("./Pages/Bidder/BidderAuctionDetailes"));
const BidderPlayerDetailes = lazy(() => import("./Pages/Bidder/BidderPlayerDeatailes"));

const UserAuction = lazy(() => import("./Pages/User/UserAuctions"));
const UserAuctionScreen = lazy(() => import("./Pages/User/UserAuctionScreen"));
const UserTeam = lazy(() => import("./Pages/User/UserTeam"));
const UserAuctionEnded = lazy(() => import("./Pages/User/UserAuctionEnded"));
const UserPlayerDetailes = lazy(() => import("./Pages/User/UserPlayerDetailes"));
const UserProfile = lazy(() => import("./Pages/User/UserProfile"));
const UserTeamPlayers = lazy(() => import("./Pages/User/UserTeamPlayers"));
const UserAuctionDeatailes = lazy(() => import("./Pages/User/UserAuctionDetailes"));

const AdminAuctionEnded = lazy(() => import("./Pages/Admin/AdminAuctionEnded"));
const AdminProfile = lazy(() => import("./Pages/Admin/AdminProfile"));

const AuctionPlayer = lazy(() => import("./Pages/Auction/AuctionPlayer"));
const PageNotFound = lazy(() => import("./Pages/Common/PageNotFound"));

/* ===== App ===== */
const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Toaster />

      <Suspense fallback={<div style={{ textAlign: "center" }}>Loading...</div>}>
        <Routes>
          {/* Common */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/create-auction" element={<AuctionCreate />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/auction/ended" element={<AdminAuctionEnded />} />

          {/* Bidder */}
          <Route path="/bidder/auctions" element={<BidderAuctions />} />
          <Route path="/bidder/auction/:id" element={<BidderAuctionScreen />} />
          <Route path="/bidder/auctiondetailes/:id" element={<BidderAuctionDetailes />} />
          <Route path="/bidder/profile" element={<BidderProfile />} />
          <Route path="/bidder/auction/ended" element={<BidderAuctionEnded />} />
          <Route path="/bidder/history" element={<BidderHistory />} />
          <Route path="/auction/bidder/player/:id" element={<BidderPlayerDetailes />} />

          {/* Auction */}
          <Route path="/auction/:id" element={<AcutionAdminPage />} />
          <Route path="/auction/:id/live" element={<AuctionScreen />} />
          <Route path="/auction/teams" element={<TeamsPage />} />
          <Route path="/auction/teams/:id" element={<BidderTeamPlayers />} />
          <Route path="/auction/teams/player/:id" element={<PlayerDetailes />} />
          <Route path="/auction/player/:id" element={<AuctionPlayer />} />

          {/* User */}
          <Route path="/user/auctions" element={<UserAuction />} />
          <Route path="/user/auction/:id" element={<UserAuctionDeatailes />} />
          <Route path="/user/auctions/:id/live" element={<UserAuctionScreen />} />
          <Route path="/user/auction/teams" element={<UserTeam />} />
          <Route path="/user/teams/player/:id" element={<UserTeamPlayers />} />
          <Route path="/user/auction/ended" element={<UserAuctionEnded />} />
          <Route path="/auction/user/player/:id" element={<UserPlayerDetailes />} />
          <Route path="/user/profile" element={<UserProfile />} />

          {/* 404 */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
