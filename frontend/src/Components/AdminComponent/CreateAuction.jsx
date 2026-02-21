import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuid } from "uuid";
import { useNavigate } from "react-router-dom";
import { socket } from "../../Socket/socket";

const DOMAIN = import.meta.env.VITE_DOMAIN;

const CreateAuction = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [auction, setAuction] = useState({
    name: "",
    time: "",
    playerTime: "",
    description: "",
    shortName: "",
    auctionImg: ""
  });

  const [franchises, setFranchises] = useState([]);
  const [players, setPlayers] = useState([]);

  const stepTabs = [
    { id: 1, name: "Auction Details", icon: "📋" },
    { id: 2, name: "Franchises", icon: "👥" },
    { id: 3, name: "Players", icon: "🏏" }
  ];

  const addFranchise = () => {
    setFranchises(prev => [
      ...prev,
      {
        id: uuid(),
        teamName: "",
        purse: "",
        email: "",
        password: ""
      }
    ]);
  };

  const removeFranchise = (id) => {
    setFranchises(prev => prev.filter(f => f.id !== id));
  };

  const addPlayer = () => {
    setPlayers(prev => [
      ...prev,
      {
        id: uuid(),
        setNo: "",
        name: "",
        country: "",
        battingStyle: "",
        runs: "",
        average: "",
        strikeRate: "",
        fifties: "",
        hundreds: "",
        basePrice: "",
        imageUrl: ""
      }
    ]);
  };

  const removePlayer = (id) => {
    setPlayers(prev => prev.filter(p => p.id !== id));
  };

  // Step-1 API: Create Auction Base
  const createAuction = async () => {
    if (!auction?.name || !auction?.time || !auction?.playerTime) {
      return toast.error("Please fill required fields");
    }

    setLoading(true);
    try {
      const response = await axios.post(
        DOMAIN + "/auction/create-auction",
        {
          auction_name: auction?.name,
          description: auction?.description,
          short_name: auction?.shortName,
          auction_date: auction?.time,
          auction_img: auction?.auctionImg,
          auction_time: auction?.playerTime
        },
        { withCredentials: true }
      );

      if (response.status === 201) {
        socket.emit("join-auction", response?.data?.newAuction?._id);
        localStorage.setItem("auctionId", response?.data?.newAuction?._id);
        toast.success("Auction Created");
        setStep(2);
      }
    } catch (err) {
      console.log(err);
      toast.error("Error creating auction");
    }
    setLoading(false);
  };

  // Final Step: Develop Auction
  const developAuction = async () => {
    const auctionId = localStorage.getItem("auctionId");

    if (!auctionId) return toast.error("Auction not initialized");

    if (franchises.length === 0) {
      return toast.error("Add at least 1 franchise");
    }

    setLoading(true);

    try {
      const response = await axios.post(
        DOMAIN + "/auction/develop-auction",
        {
          auctionId,
          auctionName: auction?.name,
          auctionTime: auction?.time,
          auctionDescription: auction?.description,
          auctionShortName: auction?.shortName,
          auctionImg: auction?.auctionImg,
          auctionPlayerTime: auction?.playerTime,
          franchises,
          players
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Auction Developed Successfully 🎉");
        navigate("/admin");
      }
    } catch (err) {
      console.log(err);
      toast.error("Error developing auction");
    }
    setLoading(false);
  };

  const pageMotion = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: "easeOut" }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-500 to-slate-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-light text-white mb-2">
            Create New <span className="font-semibold text-slate-300">Auction</span>
          </h1>
          <p className="text-slate-400 text-sm">Set up your auction in three simple steps</p>
        </div>
        
        {/* Step Progress with Icons */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {stepTabs.map((tab) => (
              <div key={tab.id} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 backdrop-blur-md ${
                    step >= tab.id 
                      ? 'bg-white/20 text-white border border-white/30 shadow-lg' 
                      : 'bg-white/5 text-slate-400 border border-white/10'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                </div>
                <span
                  className={`text-xs mt-2 font-medium ${
                    step >= tab.id ? 'text-white' : 'text-slate-400'
                  }`}
                >
                  {tab.name}
                </span>
              </div>
            ))}
          </div>
          
          {/* Progress Line */}
          <div className="relative -mt-6 mx-5">
            <div className="absolute top-5 left-0 w-full h-0.5 bg-white/10"></div>
            <div
              className="absolute top-5 left-0 h-0.5 bg-white/50 transition-all duration-500"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Animated Step Container */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div {...pageMotion}>
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6 md:p-8">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-white/50 rounded-full"></span>
                  Auction Details
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">Auction Name *</label>
                    <input
                      className="w-full px-4 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all text-white placeholder-slate-500"
                      placeholder="e.g. IPL 2024 Auction"
                      value={auction?.name}
                      onChange={(e) => setAuction({ ...auction, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">Date & Time *</label>
                    <input
                      type="datetime-local"
                      className="w-full px-4 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all text-white"
                      value={auction?.time}
                      onChange={(e) => setAuction({ ...auction, time: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">Player Bid Time (sec) *</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all text-white"
                      placeholder="e.g. 60"
                      value={auction?.playerTime}
                      onChange={(e) => setAuction({ ...auction, playerTime: e.target.value })}
                    />
                  </div>

                  <div className="md:col-span-2 lg:col-span-3 space-y-2">
                    <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">Description</label>
                    <textarea
                      rows={3}
                      placeholder="Describe the auction..."
                      className="w-full px-4 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all text-white placeholder-slate-500"
                      value={auction?.description}
                      onChange={(e) => setAuction({ ...auction, description: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">Short Name</label>
                    <input
                      className="w-full px-4 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all text-white"
                      placeholder="e.g. IPL2024"
                      value={auction?.shortName}
                      onChange={(e) => setAuction({ ...auction, shortName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">Auction Image URL</label>
                    <input
                      className="w-full px-4 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all text-white"
                      placeholder="https://example.com/image.jpg"
                      value={auction?.auctionImg}
                      onChange={(e) => setAuction({ ...auction, auctionImg: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    className="px-6 py-2.5 bg-white/20 hover:bg-white/30 text-white font-medium rounded-lg shadow-lg backdrop-blur-sm border border-white/20 hover:border-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    disabled={loading}
                    onClick={createAuction}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue to Franchises</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div {...pageMotion}>
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <span className="w-1 h-6 bg-white/50 rounded-full"></span>
                    Franchises ({franchises.length})
                  </h2>
                  <button 
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all flex items-center gap-2 border border-white/20 backdrop-blur-sm"
                    onClick={addFranchise}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Franchise
                  </button>
                </div>

                {franchises?.length === 0 ? (
                  <div className="text-center py-12 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                    <div className="text-5xl mb-3">👥</div>
                    <p className="text-slate-300 mb-4">No franchises added yet</p>
                    <button
                      onClick={addFranchise}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm transition-all backdrop-blur-sm border border-white/20"
                    >
                      Add Your First Franchise
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {franchises?.map((f, index) => (
                      <div key={f?.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/20 text-white rounded-lg flex items-center justify-center font-semibold text-sm">
                              {index + 1}
                            </div>
                            <h3 className="font-medium text-white">Franchise {index + 1}</h3>
                          </div>
                          <button
                            className="text-red-300 hover:text-red-200 text-sm px-3 py-1 hover:bg-white/10 rounded-lg transition-all"
                            onClick={() => removeFranchise(f?.id)}
                          >
                            Remove
                          </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <input
                            className="w-full px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-slate-500"
                            placeholder="Team Name"
                            value={f?.teamName}
                            onChange={(e) => {
                              const copy = [...franchises];
                              copy[index].teamName = e.target.value;
                              setFranchises(copy);
                            }}
                          />

                          <input
                            className="w-full px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-slate-500"
                            placeholder="Purse Amount (e.g. 100000000)"
                            value={f?.purse}
                            onChange={(e) => {
                              const copy = [...franchises];
                              copy[index].purse = e.target.value;
                              setFranchises(copy);
                            }}
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mt-3">
                          <input
                            className="w-full px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-slate-500"
                            placeholder="Email"
                            type="email"
                            value={f?.email}
                            onChange={(e) => {
                              const copy = [...franchises];
                              copy[index].email = e.target.value;
                              setFranchises(copy);
                            }}
                          />

                          <input
                            type="password"
                            className="w-full px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-slate-500"
                            placeholder="Password"
                            value={f?.password}
                            onChange={(e) => {
                              const copy = [...franchises];
                              copy[index].password = e.target.value;
                              setFranchises(copy);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between mt-8">
                  <button 
                    className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg border border-white/20 shadow-sm hover:shadow transition-all flex items-center gap-2 backdrop-blur-sm"
                    onClick={() => setStep(1)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                  <button 
                    className="px-6 py-2.5 bg-white/20 hover:bg-white/30 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 backdrop-blur-sm border border-white/20"
                    onClick={() => setStep(3)}
                  >
                    Continue to Players
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div {...pageMotion}>
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <span className="w-1 h-6 bg-white/50 rounded-full"></span>
                    Players ({players.length})
                  </h2>
                  <button 
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all flex items-center gap-2 border border-white/20 backdrop-blur-sm"
                    onClick={addPlayer}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Player
                  </button>
                </div>

                {players?.length === 0 ? (
                  <div className="text-center py-12 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                    <div className="text-5xl mb-3">🏏</div>
                    <p className="text-slate-300 mb-4">No players added yet</p>
                    <button
                      onClick={addPlayer}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm transition-all backdrop-blur-sm border border-white/20"
                    >
                      Add Your First Player
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                    {players?.map((p, index) => (
                      <div key={p?.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/20 text-white rounded-lg flex items-center justify-center font-semibold text-sm">
                              {index + 1}
                            </div>
                            <h3 className="font-medium text-white">Player {index + 1}</h3>
                          </div>
                          <button
                            className="text-red-300 hover:text-red-200 text-sm px-3 py-1 hover:bg-white/10 rounded-lg transition-all"
                            onClick={() => removePlayer(p?.id)}
                          >
                            Remove
                          </button>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                          <input
                            className="px-3 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-sm text-white placeholder-slate-500"
                            placeholder="Set No"
                            value={p?.setNo}
                            onChange={(e) => {
                              const copy = [...players];
                              copy[index].setNo = e.target.value;
                              setPlayers(copy);
                            }}
                          />

                          <input
                            className="px-3 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-sm text-white placeholder-slate-500"
                            placeholder="Player Name"
                            value={p?.name}
                            onChange={(e) => {
                              const copy = [...players];
                              copy[index].name = e.target.value;
                              setPlayers(copy);
                            }}
                          />

                          <input
                            className="px-3 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-sm text-white placeholder-slate-500"
                            placeholder="Country"
                            value={p?.country}
                            onChange={(e) => {
                              const copy = [...players];
                              copy[index].country = e.target.value;
                              setPlayers(copy);
                            }}
                          />

                          <input
                            className="px-3 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-sm text-white placeholder-slate-500"
                            placeholder="Batting Style"
                            value={p?.battingStyle}
                            onChange={(e) => {
                              const copy = [...players];
                              copy[index].battingStyle = e.target.value;
                              setPlayers(copy);
                            }}
                          />

                          <input
                            className="px-3 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-sm text-white placeholder-slate-500"
                            placeholder="Runs"
                            value={p?.runs}
                            onChange={(e) => {
                              const copy = [...players];
                              copy[index].runs = e.target.value;
                              setPlayers(copy);
                            }}
                          />

                          <input
                            className="px-3 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-sm text-white placeholder-slate-500"
                            placeholder="Average"
                            value={p?.average}
                            onChange={(e) => {
                              const copy = [...players];
                              copy[index].average = e.target.value;
                              setPlayers(copy);
                            }}
                          />

                          <input
                            className="px-3 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-sm text-white placeholder-slate-500"
                            placeholder="Strike Rate"
                            value={p?.strikeRate}
                            onChange={(e) => {
                              const copy = [...players];
                              copy[index].strikeRate = e.target.value;
                              setPlayers(copy);
                            }}
                          />

                          <input
                            className="px-3 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-sm text-white placeholder-slate-500"
                            placeholder="Fifties"
                            value={p?.fifties}
                            onChange={(e) => {
                              const copy = [...players];
                              copy[index].fifties = e.target.value;
                              setPlayers(copy);
                            }}
                          />

                          <input
                            className="px-3 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-sm text-white placeholder-slate-500"
                            placeholder="Hundreds"
                            value={p?.hundreds}
                            onChange={(e) => {
                              const copy = [...players];
                              copy[index].hundreds = e.target.value;
                              setPlayers(copy);
                            }}
                          />

                          <input
                            className="px-3 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-sm text-white placeholder-slate-500"
                            placeholder="Base Price"
                            value={p?.basePrice}
                            onChange={(e) => {
                              const copy = [...players];
                              copy[index].basePrice = e.target.value;
                              setPlayers(copy);
                            }}
                          />

                          <input
                            className="px-3 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-sm text-white placeholder-slate-500"
                            placeholder="Image URL"
                            value={p?.imageUrl}
                            onChange={(e) => {
                              const copy = [...players];
                              copy[index].imageUrl = e.target.value;
                              setPlayers(copy);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between mt-8">
                  <button 
                    className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg border border-white/20 shadow-sm hover:shadow transition-all flex items-center gap-2 backdrop-blur-sm"
                    onClick={() => setStep(2)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                  <button 
                    className="px-6 py-2.5 bg-emerald-500/80 hover:bg-emerald-500 text-white font-medium rounded-lg shadow-lg shadow-emerald-900/30 hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-2 backdrop-blur-sm border border-emerald-400/30"
                    disabled={loading}
                    onClick={developAuction}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Auction</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 20px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default CreateAuction;