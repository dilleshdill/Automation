import React, { lazy, Suspense } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";

/* ===== Lazy Imports ===== */
const LoginPage = lazy(() => import("./Pages/Common/LoginPage"));
const HomePage = lazy(() => import("./Pages/Common/HomePage"));

const AdminPage = lazy(() => import("./Pages/Admin/AdminPage"));
const AuctionCreate = lazy(() => import("./Pages/Auction/AuctionCreate"));
const AdminProfile = lazy(() => import("./Pages/Admin/AdminProfile"));
const AdminAuctionEnded = lazy(() => import("./Pages/Admin/AdminAuctionEnded"));
const AcutionAdminPage = lazy(() => import("./Pages/Admin/AuctionAdminPage"));

const BidderAuctions = lazy(() => import("./Pages/Bidder/BidderAuctions"));
const BidderAuctionScreen = lazy(() => import("./Pages/Bidder/BidderAuctionScreen"));
const BidderAuctionDetailes = lazy(() => import("./Pages/Bidder/BidderAuctionDetailes"));
const BidderProfile = lazy(() => import("./Pages/Bidder/BidderProfile"));
const BidderAuctionEnded = lazy(() => import("./Pages/Bidder/BidderAuctionEnded"));
const BidderHistory = lazy(() => import("./Pages/Bidder/BidderHistory"));
const BidderPlayerDetailes = lazy(() => import("./Pages/Bidder/BidderPlayerDeatailes"));

const TeamsPage = lazy(() => import("./Pages/Bidder/TeamsPage"));
const BidderTeamPlayers = lazy(() => import("./Pages/Bidder/BidderTeamPlayers"));

const AuctionScreen = lazy(() => import("./Pages/Auction/AuctionScreen"));
const AuctionPlayer = lazy(() => import("./Pages/Auction/AuctionPlayer"));
const PlayerDetailes = lazy(() => import("./Pages/Player/PlayerDetailes"));

const UserAuction = lazy(() => import("./Pages/User/UserAuctions"));
const UserAuctionScreen = lazy(() => import("./Pages/User/UserAuctionScreen"));
const UserAuctionDeatailes = lazy(() => import("./Pages/User/UserAuctionDetailes"));
const UserTeam = lazy(() => import("./Pages/User/UserTeam"));
const UserTeamPlayers = lazy(() => import("./Pages/User/UserTeamPlayers"));
const UserAuctionEnded = lazy(() => import("./Pages/User/UserAuctionEnded"));
const UserPlayerDetailes = lazy(() => import("./Pages/User/UserPlayerDetailes"));
const UserProfile = lazy(() => import("./Pages/User/UserProfile"));

const PageNotFound = lazy(() => import("./Pages/Common/PageNotFound"));

/* ===== App ===== */
const App = () => {
  return (
    <HashRouter>
      <ToastContainer />
      <Toaster />

      <Suspense fallback={<div style={{ textAlign: "center" }}>Loading...</div>}>
        <Routes>

          {/* ===== COMMON ===== */}
          <Route exact path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />

          {/* ===== ADMIN ===== */}
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/create-auction" element={<AuctionCreate />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/auction/ended" element={<AdminAuctionEnded />} />

          {/* ===== AUCTION (ADMIN) ===== */}
          <Route path="/auction/:id" element={<AcutionAdminPage />} />
          <Route path="/auction/:id/live" element={<AuctionScreen />} />
          <Route path="/auction/player/:id" element={<AuctionPlayer />} />

          {/* ===== BIDDER ===== */}
          <Route path="/bidder/auctions" element={<BidderAuctions />} />
          <Route path="/bidder/auction/:id" element={<BidderAuctionScreen />} />
          <Route path="/bidder/auctiondetailes/:id" element={<BidderAuctionDetailes />} />
          <Route path="/bidder/profile" element={<BidderProfile />} />
          <Route path="/bidder/auction/ended" element={<BidderAuctionEnded />} />
          <Route path="/bidder/history" element={<BidderHistory />} />
          <Route path="/auction/bidder/player/:id" element={<BidderPlayerDetailes />} />

          {/* ===== TEAMS ===== */}
          <Route path="/auction/teams" element={<TeamsPage />} />
          <Route path="/auction/teams/:id" element={<BidderTeamPlayers />} />
          <Route path="/auction/teams/player/:id" element={<PlayerDetailes />} />

          {/* ===== USER ===== */}
          <Route path="/user/auctions" element={<UserAuction />} />
          <Route path="/user/auction/:id" element={<UserAuctionDeatailes />} />
          <Route path="/user/auctions/:id/live" element={<UserAuctionScreen />} />
          <Route path="/user/auction/teams" element={<UserTeam />} />
          <Route path="/user/teams/player/:id" element={<UserTeamPlayers />} />
          <Route path="/user/auction/ended" element={<UserAuctionEnded />} />
          <Route path="/auction/user/player/:id" element={<UserPlayerDetailes />} />
          <Route path="/user/profile" element={<UserProfile />} />

          {/* ===== 404 ===== */}
          <Route path="*" element={<PageNotFound />} />

        </Routes>
      </Suspense>
    </HashRouter>
  );
};

export default App;
