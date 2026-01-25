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
      }
    } catch (err) {
      setLoader(false);
    }
  };

  return (
    <>
      <AdminHomeNavBar />
      {showLoader && <Loader />}

      <div className="min-h-screen !bg-[#f4f5f7] px-6 py-8">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md p-8 border border-slate-200">

          {/* HEADER */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-semibold text-[#1c1e21] tracking-wide">
              Auction Overview
            </h1>

            <span className={`px-4 py-1 rounded-full text-sm font-semibold 
              ${auction.status === "upcoming" && "!bg-yellow-100 text-yellow-700 border border-yellow-300"} 
              ${auction.status === "live" && "!bg-green-100 text-green-700 border border-green-300"} 
              ${auction.status === "paused" && "!bg-blue-100 text-blue-700 border border-blue-300"} 
              ${auction.status === "ended" && "!bg-red-100 text-red-700 border border-red-300"}`}>
              {auction.status?.toUpperCase()}
            </span>
          </div>

          {/* TOP GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* IMAGE */}
            <div className="flex justify-center">
              <img
                src={auction.auction_img}
                alt={auction.auction_name}
                className="w-72 h-80 object-cover rounded-lg border shadow-md"
              />
            </div>

            {/* DETAILS */}
            <div className="flex flex-col justify-start space-y-4">
              <Section label="Auction Name" value={auction.auction_name} />
              <Section label="Short Name" value={auction.shorts} />
              <Section label="Player Time" value={`${auction.auction_time}s`} />
              <Section label="Status" value={auction.status} />
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col gap-4 justify-start lg:mt-6">
              <button
                className="px-6 py-3 !bg-[#003f88] hover:!bg-[#0050b5] text-white rounded-lg font-semibold shadow transition"
                onClick={() => setShowPlayerModal(true)}
              >
                ➕ Add Players
              </button>

              <button
                className="px-6 py-3 !bg-[#008000] !hover:bg-[#009d00] text-white rounded-lg font-semibold shadow transition"
                onClick={() => setShowFranchiseModal(true)}
              >
                🏏 Add Franchise
              </button>
            </div>

          </div>

          {/* DESCRIPTION SECTION */}
          <div className="mt-10 border-t pt-6">
            <h2 className="text-xl font-semibold mb-2 text-[#1c1e21]">
              Description
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              {auction.description || "No description provided."}
            </p>
          </div>
        </div>
      </div>

      {/* PLAYER MODAL */}
      {showPlayerModal && (
        <Modal title="Add Players" onClose={() => setShowPlayerModal(false)}>
          <button className="btn-sports mb-4" onClick={addPlayer}>
            + Add Player
          </button>

          {players.map((p, index) => (
            <PlayerForm
              key={p.id}
              index={index}
              players={players}
              setPlayers={setPlayers}
            />
          ))}

          <ModalFooter onSave={savePlayers} onClose={() => setShowPlayerModal(false)} />
        </Modal>
      )}

      {/* FRANCHISE MODAL */}
      {showFranchiseModal && (
        <Modal title="Add Franchises" onClose={() => setShowFranchiseModal(false)}>
          <button className="btn-sports mb-4" onClick={addFranchise}>
            + Add Franchise
          </button>

          {franchises.map((f, index) => (
            <FranchiseForm
              key={f.id}
              index={index}
              franchises={franchises}
              setFranchises={setFranchises}
            />
          ))}

          <ModalFooter onSave={saveFranchise} onClose={() => setShowFranchiseModal(false)} />
        </Modal>
      )}
    </>
  );
};

// SECTION COMPONENT (SPORT THEME)
const Section = ({ label, value }) => (
  <div>
    <p className="text-xs font-semibold uppercase text-slate-500 tracking-wide">{label}</p>
    <p className="text-[15px] font-medium text-slate-800">{value || "-"}</p>
  </div>
);

// MODAL WRAPPER
const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-3">
    <div className="bg-white w-full max-w-4xl rounded-xl shadow-xl p-6 border border-slate-200 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <button className="text-xl font-semibold" onClick={onClose}>✕</button>
      </div>
      {children}
    </div>
  </div>
);

// PLAYER FORM
const PlayerForm = ({ players, setPlayers, index }) => {
  const update = (field, value) => {
    const copy = [...players];
    copy[index][field] = value;
    setPlayers(copy);
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm !bg-slate-50 mb-4">
      <h3 className="font-medium text-slate-700 mb-2">Player {index + 1}</h3>

      <div className="grid grid-cols-3 gap-3">
        {[
          ["setNo", "Set No"],
          ["name", "Player Name"],
          ["country", "Country"],
          ["battingStyle", "Batting Style"],
          ["runs", "Runs"],
          ["average", "Average"],
          ["strikeRate", "Strike Rate"],
          ["fifties", "50s"],
          ["hundreds", "100s"],
          ["basePrice", "Base Price"],
          ["imageUrl", "Image URL"],
        ].map(([field, label]) => (
          <input
            key={field}
            className="input"
            placeholder={label}
            onChange={(e) => update(field, e.target.value)}
          />
        ))}
      </div>
    </div>
  );
};

// FRANCHISE FORM
const FranchiseForm = ({ franchises, setFranchises, index }) => {
  const update = (field, value) => {
    const copy = [...franchises];
    copy[index][field] = value;
    setFranchises(copy);
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm !bg-slate-50 mb-4">
      <h3 className="font-medium text-slate-700 mb-2">Franchise {index + 1}</h3>

      <div className="grid grid-cols-2 gap-3">
        <input className="input" placeholder="Team Name" onChange={(e) => update("teamName", e.target.value)} />
        <input className="input" placeholder="Purse Amount" onChange={(e) => update("purse", e.target.value)} />
        <input className="input" placeholder="Franchise Email" onChange={(e) => update("email", e.target.value)} />
        <input className="input" placeholder="Password" onChange={(e) => update("password", e.target.value)} />
      </div>
    </div>
  );
};

// MODAL FOOTER
const ModalFooter = ({ onSave, onClose }) => (
  <div className="flex justify-end gap-3 mt-4">
    <button className="px-4 py-2 border rounded-md" onClick={onClose}>
      Cancel
    </button>
    <button className="px-5 py-2 !bg-[#003f88] text-white rounded-md hover:!bg-[#0050b5]" onClick={onSave}>
      Save
    </button>
  </div>
);

export default AuctionAdminPage;
