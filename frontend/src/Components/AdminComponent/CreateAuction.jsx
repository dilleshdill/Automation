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

  const stepTabs = ["Auction", "Franchises", "Players"];

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
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
    transition: { duration: 0.25, ease: "easeOut" }
  };

  return (
    <div className="min-h-screen min-w-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Step Progress */}
        <div className="flex justify-between font-semibold text-sm">
          {stepTabs.map((tab, i) => (
            <span
              key={i}
              className={`tracking-wide ${
                step === i + 1 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              {tab}
            </span>
          ))}
        </div>

        <div className="w-full h-1 bg-gray-300 rounded-full">
          <div
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Animated Step Container */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div {...pageMotion} className="glass-card space-y-4">
              <h2 className="section-title">Create Auction</h2>

              <div className="grid md:grid-cols-3 gap-4">
                <input
                  className="input"
                  placeholder="Auction Name"
                  value={auction?.name}
                  onChange={(e) => setAuction({ ...auction, name: e.target.value })}
                />

                <input
                  type="datetime-local"
                  className="input"
                  value={auction?.time}
                  onChange={(e) => setAuction({ ...auction, time: e.target.value })}
                />

                <input
                  type="number"
                  className="input"
                  placeholder="Player Bid Time (sec)"
                  value={auction?.playerTime}
                  onChange={(e) => setAuction({ ...auction, playerTime: e.target.value })}
                />

                <textarea
                  rows={3}
                  placeholder="Description"
                  className="input md:col-span-3"
                  value={auction?.description}
                  onChange={(e) => setAuction({ ...auction, description: e.target.value })}
                />

                <input
                  className="input"
                  placeholder="Short Name (e.g. IPL2024)"
                  value={auction?.shortName}
                  onChange={(e) => setAuction({ ...auction, shortName: e.target.value })}
                />

                <input
                  className="input"
                  placeholder="Auction Image URL"
                  value={auction?.auctionImg}
                  onChange={(e) => setAuction({ ...auction, auctionImg: e.target.value })}
                />
              </div>

              <div className="flex justify-end">
                <button
                  className="btn-primary"
                  disabled={loading}
                  onClick={createAuction}
                >
                  {loading ? "Processing..." : "Next → Franchises"}
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div {...pageMotion} className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="section-title">Franchises</h2>
                <button className="btn-secondary" onClick={addFranchise}>
                  + Add Franchise
                </button>
              </div>

              {franchises?.map((f, index) => (
                <div key={f?.id} className="glass-card space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-700">
                      Franchise {index + 1}
                    </h3>
                    <button
                      className="text-red-500 text-sm"
                      onClick={() => removeFranchise(f?.id)}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      className="input"
                      placeholder="Team Name"
                      value={f?.teamName}
                      onChange={(e) => {
                        const copy = [...franchises];
                        copy[index].teamName = e.target.value;
                        setFranchises(copy);
                      }}
                    />

                    <input
                      className="input"
                      placeholder="Purse Amount"
                      value={f?.purse}
                      onChange={(e) => {
                        const copy = [...franchises];
                        copy[index].purse = e.target.value;
                        setFranchises(copy);
                      }}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      className="input"
                      placeholder="Franchise Email"
                      value={f?.email}
                      onChange={(e) => {
                        const copy = [...franchises];
                        copy[index].email = e.target.value;
                        setFranchises(copy);
                      }}
                    />

                    <input
                      type="password"
                      className="input"
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

              <div className="flex justify-between">
                <button className="btn-secondary" onClick={() => setStep(1)}>
                  ← Back
                </button>
                <button className="btn-primary" onClick={() => setStep(3)}>
                  Next → Players
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div {...pageMotion} className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="section-title">Players</h2>
                <button className="btn-secondary" onClick={addPlayer}>
                  + Add Player
                </button>
              </div>

              {players?.map((p, index) => (
                <div key={p?.id} className="glass-card space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-700">
                      Player {index + 1}
                    </h3>
                    <button
                      className="text-red-500 text-sm"
                      onClick={() => removePlayer(p?.id)}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid md:grid-cols-3 gap-3">
                    <input
                      className="input"
                      placeholder="Set No"
                      value={p?.setNo}
                      onChange={(e) => {
                        const copy = [...players];
                        copy[index].setNo = e.target.value;
                        setPlayers(copy);
                      }}
                    />

                    <input
                      className="input"
                      placeholder="Player Name"
                      value={p?.name}
                      onChange={(e) => {
                        const copy = [...players];
                        copy[index].name = e.target.value;
                        setPlayers(copy);
                      }}
                    />

                    <input
                      className="input"
                      placeholder="Country"
                      value={p?.country}
                      onChange={(e) => {
                        const copy = [...players];
                        copy[index].country = e.target.value;
                        setPlayers(copy);
                      }}
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-3">
                    <input
                      className="input"
                      placeholder="Batting Style"
                      value={p?.battingStyle}
                      onChange={(e) => {
                        const copy = [...players];
                        copy[index].battingStyle = e.target.value;
                        setPlayers(copy);
                      }}
                    />

                    <input
                      className="input"
                      placeholder="Runs"
                      value={p?.runs}
                      onChange={(e) => {
                        const copy = [...players];
                        copy[index].runs = e.target.value;
                        setPlayers(copy);
                      }}
                    />

                    <input
                      className="input"
                      placeholder="Average"
                      value={p?.average}
                      onChange={(e) => {
                        const copy = [...players];
                        copy[index].average = e.target.value;
                        setPlayers(copy);
                      }}
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-3">
                    <input
                      className="input"
                      placeholder="Strike Rate"
                      value={p?.strikeRate}
                      onChange={(e) => {
                        const copy = [...players];
                        copy[index].strikeRate = e.target.value;
                        setPlayers(copy);
                      }}
                    />

                    <input
                      className="input"
                      placeholder="Fifties"
                      value={p?.fifties}
                      onChange={(e) => {
                        const copy = [...players];
                        copy[index].fifties = e.target.value;
                        setPlayers(copy);
                      }}
                    />

                    <input
                      className="input"
                      placeholder="Hundreds"
                      value={p?.hundreds}
                      onChange={(e) => {
                        const copy = [...players];
                        copy[index].hundreds = e.target.value;
                        setPlayers(copy);
                      }}
                    />

                    <input
                      className="input"
                      placeholder="Base Price"
                      value={p?.basePrice}
                      onChange={(e) => {
                        const copy = [...players];
                        copy[index].basePrice = e.target.value;
                        setPlayers(copy);
                      }}
                    />

                    <input
                      className="input"
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

              <div className="flex justify-between">
                <button className="btn-secondary" onClick={() => setStep(2)}>
                  ← Back
                </button>
                <button className="btn-primary" disabled={loading} onClick={developAuction}>
                  {loading ? "Saving..." : "✓ Create Auction"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CreateAuction;
