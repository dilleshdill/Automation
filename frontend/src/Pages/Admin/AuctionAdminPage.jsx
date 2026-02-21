import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AdminHomeNavBar from "../../Components/AdminComponent/AdminHomeNavBar";
import Loader from "../../Loader/Loader";

const DOMAIN = import.meta.env.VITE_DOMAIN;

const AuctionAdminPage = () => {
  const [auction, setAuction] = useState({});
  const location = useLocation();
  const { id } = location.state || {};

  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [showFranchiseModal, setShowFranchiseModal] = useState(false);
  const [showLoader, setLoader] = useState(false);

  const [franchises, setFranchises] = useState([]);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const response = await axios.post(
          `${DOMAIN}/auction/get-auction`,
          { auction_id: id },
          { withCredentials: true }
        );

        if (response.status === 200) {
          setAuction(response.data.existingAuction);
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (id) fetchAuction();
  }, [id]);

  const addFranchise = () => {
    setFranchises([
      ...franchises,
      {
        id: Date.now(),
        teamName: "",
        purse: "",
        email: "",
        password: "",
      },
    ]);
  };

  const addPlayer = () => {
    setPlayers([
      ...players,
      {
        id: Date.now(),
        setNo: 0,
        name: "",
        country: "",
        battingStyle: "",
        runs: 0,
        average: 0,
        strikeRate: 0,
        fifties: 0,
        hundreds: 0,
        basePrice: 0,
        imageUrl: "",
      },
    ]);
  };

  const savePlayers = async () => {
    setLoader(true);
    try {
      const response = await axios.post(
        `${DOMAIN}/add-player`,
        {
          auctionId: id,
          players,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setLoader(false);
        setShowPlayerModal(false);
        setPlayers([]);
      }
    } catch (err) {
      setLoader(false);
    }
  };

  const saveFranchise = async () => {
    setLoader(true);
    try {
      const response = await axios.post(
        `${DOMAIN}/bidder/add-franchsis`,
        {
          auctionId: id,
          franchises,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setLoader(false);
        setShowFranchiseModal(false);
        setFranchises([]);
      }
    } catch (err) {
      setLoader(false);
    }
  };

  const getStatusStyles = (status) => {
    const styles = {
      upcoming: "bg-slate-100 text-slate-700 border-slate-300",
      live: "bg-green-100 text-green-700 border-green-300",
      paused: "bg-yellow-100 text-yellow-700 border-yellow-300",
      ended: "bg-red-100 text-red-700 border-red-300"
    };
    return styles[status] || "bg-slate-100 text-slate-700 border-slate-300";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <AdminHomeNavBar />
      {showLoader && <Loader />}

      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Main Card - Redesigned */}
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            
            {/* Header with Pattern */}
            <div className="relative bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-6 overflow-hidden">
              {/* Decorative Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-8 -mb-8"></div>
              
              <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
                    <span className="text-3xl">🏟️</span>
                    Auction Overview
                  </h1>
                  <p className="text-slate-300 text-sm mt-1">Manage your auction details and add participants</p>
                </div>
                <span className={`inline-block px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border-2 shadow-lg ${getStatusStyles(auction?.status)}`}>
                  {auction?.status?.toUpperCase() || "UPCOMING"}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 lg:p-10">
              
              {/* Top Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                
                {/* Image Section - 4 columns */}
                <div className="lg:col-span-4">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 shadow-inner">
                    <div className="relative rounded-xl overflow-hidden border-2 border-slate-300">
                      <img
                        src={auction?.auction_img || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80"}
                        alt={auction?.auction_name}
                        className="w-full h-72 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                      <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-white text-xs font-medium">Auction Image</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details Section - 5 columns */}
                <div className="lg:col-span-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DetailCard 
                      label="Auction Name" 
                      value={auction?.auction_name}
                      icon="📋"
                    />
                    <DetailCard 
                      label="Short Name" 
                      value={auction?.shorts}
                      icon="🏷️"
                    />
                    <DetailCard 
                      label="Player Time" 
                      value={auction?.auction_time ? `${auction.auction_time}s` : "-"}
                      icon="⏱️"
                    />
                    <DetailCard 
                      label="Date" 
                      value={auction?.auction_date}
                      icon="📅"
                    />
                    <DetailCard 
                      label="Status" 
                      value={auction?.status}
                      icon="📊"
                      className="sm:col-span-2"
                    />
                  </div>
                </div>

                {/* Actions Section - 3 columns */}
                <div className="lg:col-span-3">
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 h-full flex flex-col justify-center">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Quick Actions</h3>
                    <div className="flex flex-col gap-3">
                      <ActionButton
                        icon="➕"
                        label="Add Players"
                        onClick={() => setShowPlayerModal(true)}
                        color="slate"
                      />
                      <ActionButton
                        icon="🏏"
                        label="Add Franchise"
                        onClick={() => setShowFranchiseModal(true)}
                        color="slate"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Description Section - Redesigned */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border border-slate-200">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl">📝</span>
                    <h2 className="text-lg font-semibold text-slate-800">Description</h2>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {auction?.description || "No description provided for this auction."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Player Modal - Redesigned */}
      {showPlayerModal && (
        <Modal 
          title="Add Players" 
          icon="➕" 
          onClose={() => {
            setShowPlayerModal(false);
            setPlayers([]);
          }}
        >
          <div className="space-y-5">
            <button
              className="w-full py-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl border-2 border-dashed border-slate-300 transition-all flex items-center justify-center gap-2 group"
              onClick={addPlayer}
            >
              <span className="text-xl group-hover:scale-110 transition-transform">➕</span>
              Add New Player
            </button>

            {players.length > 0 ? (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {players.map((p, index) => (
                  <PlayerCard
                    key={p.id}
                    index={index}
                    players={players}
                    setPlayers={setPlayers}
                  />
                ))}
              </div>
            ) : (
              <EmptyState message="No players added yet" />
            )}

            {players.length > 0 && (
              <ModalFooter 
                onSave={savePlayers} 
                onClose={() => {
                  setShowPlayerModal(false);
                  setPlayers([]);
                }} 
              />
            )}
          </div>
        </Modal>
      )}

      {/* Franchise Modal - Redesigned */}
      {showFranchiseModal && (
        <Modal 
          title="Add Franchises" 
          icon="🏏" 
          onClose={() => {
            setShowFranchiseModal(false);
            setFranchises([]);
          }}
        >
          <div className="space-y-5">
            <button
              className="w-full py-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl border-2 border-dashed border-slate-300 transition-all flex items-center justify-center gap-2 group"
              onClick={addFranchise}
            >
              <span className="text-xl group-hover:scale-110 transition-transform">➕</span>
              Add New Franchise
            </button>

            {franchises.length > 0 ? (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {franchises.map((f, index) => (
                  <FranchiseCard
                    key={f.id}
                    index={index}
                    franchises={franchises}
                    setFranchises={setFranchises}
                  />
                ))}
              </div>
            ) : (
              <EmptyState message="No franchises added yet" />
            )}

            {franchises.length > 0 && (
              <ModalFooter 
                onSave={saveFranchise} 
                onClose={() => {
                  setShowFranchiseModal(false);
                  setFranchises([]);
                }} 
              />
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

// Redesigned Detail Card
const DetailCard = ({ label, value, icon, className = "" }) => (
  <div className={`bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all ${className}`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-base font-semibold text-slate-800">
          {value || "-"}
        </p>
      </div>
      <span className="text-2xl opacity-50">{icon}</span>
    </div>
  </div>
);

// Action Button Component
const ActionButton = ({ icon, label, onClick, color = "slate" }) => (
  <button
    onClick={onClick}
    className="group relative overflow-hidden bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border-2 border-slate-200 hover:border-slate-300 transition-all transform hover:scale-[1.02] shadow-md hover:shadow-lg p-4 flex items-center justify-between"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
    <span className="flex items-center gap-3">
      <span className="text-xl">{icon}</span>
      {label}
    </span>
    <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
  </button>
);

// Player Card Component (Redesigned)
const PlayerCard = ({ players, setPlayers, index }) => {
  const update = (field, value) => {
    const copy = [...players];
    copy[index][field] = value;
    setPlayers(copy);
  };

  const remove = () => {
    const copy = players.filter((_, i) => i !== index);
    setPlayers(copy);
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
      {/* Card Header */}
      <div className="bg-slate-100 px-5 py-3 flex justify-between items-center border-b border-slate-200">
        <h3 className="font-semibold text-slate-700 flex items-center gap-2">
          <span className="w-6 h-6 bg-slate-700 text-white rounded-full flex items-center justify-center text-xs">
            {index + 1}
          </span>
          Player {index + 1}
        </h3>
        <button
          onClick={remove}
          className="text-slate-400 hover:text-red-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Card Body */}
      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <InputField label="Set No" value={players[index].setNo} onChange={(v) => update("setNo", v)} />
          <InputField label="Player Name" value={players[index].name} onChange={(v) => update("name", v)} />
          <InputField label="Country" value={players[index].country} onChange={(v) => update("country", v)} />
          <InputField label="Batting Style" value={players[index].battingStyle} onChange={(v) => update("battingStyle", v)} />
          <InputField label="Runs" type="number" value={players[index].runs} onChange={(v) => update("runs", v)} />
          <InputField label="Average" type="number" value={players[index].average} onChange={(v) => update("average", v)} />
          <InputField label="Strike Rate" type="number" value={players[index].strikeRate} onChange={(v) => update("strikeRate", v)} />
          <InputField label="50s" type="number" value={players[index].fifties} onChange={(v) => update("fifties", v)} />
          <InputField label="100s" type="number" value={players[index].hundreds} onChange={(v) => update("hundreds", v)} />
          <InputField label="Base Price" type="number" value={players[index].basePrice} onChange={(v) => update("basePrice", v)} />
          <InputField label="Image URL" value={players[index].imageUrl} onChange={(v) => update("imageUrl", v)} className="lg:col-span-2" />
        </div>
      </div>
    </div>
  );
};

// Franchise Card Component (Redesigned)
const FranchiseCard = ({ franchises, setFranchises, index }) => {
  const update = (field, value) => {
    const copy = [...franchises];
    copy[index][field] = value;
    setFranchises(copy);
  };

  const remove = () => {
    const copy = franchises.filter((_, i) => i !== index);
    setFranchises(copy);
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
      {/* Card Header */}
      <div className="bg-slate-100 px-5 py-3 flex justify-between items-center border-b border-slate-200">
        <h3 className="font-semibold text-slate-700 flex items-center gap-2">
          <span className="w-6 h-6 bg-slate-700 text-white rounded-full flex items-center justify-center text-xs">
            {index + 1}
          </span>
          Franchise {index + 1}
        </h3>
        <button
          onClick={remove}
          className="text-slate-400 hover:text-red-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Card Body */}
      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Team Name" value={franchises[index].teamName} onChange={(v) => update("teamName", v)} />
          <InputField label="Purse Amount" type="number" value={franchises[index].purse} onChange={(v) => update("purse", v)} />
          <InputField label="Email" type="email" value={franchises[index].email} onChange={(v) => update("email", v)} />
          <InputField label="Password" type="password" value={franchises[index].password} onChange={(v) => update("password", v)} />
        </div>
      </div>
    </div>
  );
};

// Input Field Component (Redesigned)
const InputField = ({ label, value, onChange, type = "text", className = "" }) => (
  <div className={className}>
    <label className="block text-xs font-medium text-slate-600 mb-1.5">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all text-sm shadow-sm hover:border-slate-300"
      placeholder={`Enter ${label.toLowerCase()}`}
    />
  </div>
);

// Modal Component (Redesigned)
const Modal = ({ title, icon, children, onClose }) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
    <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl border border-slate-200">
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          {title}
        </h2>
        <button 
          className="text-white/70 hover:text-white text-2xl font-semibold transition-colors"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
      <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
        {children}
      </div>
    </div>
  </div>
);

// Empty State Component
const EmptyState = ({ message }) => (
  <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
    <span className="text-5xl mb-3 block opacity-30">📋</span>
    <p className="text-slate-500 font-medium">{message}</p>
    <p className="text-slate-400 text-sm mt-1">Click the button above to add</p>
  </div>
);

// Modal Footer Component (Redesigned)
const ModalFooter = ({ onSave, onClose }) => (
  <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row justify-end gap-3 mt-6">
    <button
      className="px-6 py-2.5 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all"
      onClick={onClose}
    >
      Cancel
    </button>
    <button
      className="px-6 py-2.5 bg-slate-700 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
      onClick={onSave}
    >
      <span>💾</span>
      Save All
    </button>
  </div>
);

export default AuctionAdminPage;