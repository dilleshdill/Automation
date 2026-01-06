import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Cookies } from "react-cookie";
const DOMAIN = import.meta.env.VITE_DOMAIN;
import { useNavigate } from "react-router-dom";

const CreateAuction = () => {
  const [step, setStep] = useState(1);
  const Navigate = useNavigate();


  const [auction, setAuction] = useState({
    name: "ipl",
    time: "30",
    playerTime: "30",
    description:"sdfgh",
    shortName:"sdf",
    auctionImg:"sdfg" 
  });

  
  const [franchises, setFranchises] = useState([]);

  const [players, setPlayers] = useState([]);

  
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
        setNo: "",
        name: "",
        country: "",
        battingStyle: "",
        runs: "",
        average: "",
        strikeRate: "",
        fifties: "",
        hundreds: "",
      },
    ]);
  };

  const CreateAuction = async() => {
    console.log("AUCTION CREATED", auction)
    try{
        const response = await axios.post(DOMAIN + "/auction/create-auction",{
            auction_name:auction.name,
            description:auction.description,
            short_name:auction.shortName,
            auction_date:auction.time,
            auction_img:auction.auctionImg,
            auction_time:auction.playerTime
        },
    {withCredentials: true});
        if(response.status === 201){
            console.log(response.data)
            localStorage.setItem("auctionId",response.data._id)
            toast.success("Auction Created Successfully");
        }

    }catch(err){
        console.log(err);
        toast.error("Error in creating auction")
    }
    };

  // ---------- SUBMIT ----------
  const DevelopAction = () => {

    try{
        const auctionId = localStorage.getItem("auctionId")
        toast.info(auctionId)
        const response = axios.post(DOMAIN + "/auction/develop-auction",{
            auctionId: auctionId,
            auctionName:auction.name,
            auctionTime:auction.time,
            auctionDescription:auction.description, 
            auctionShortName:auction.shortName,
            auctionImg:auction.auctionImg,
            auctionPlayerTime:auction.playerTime,
            franchises:franchises,
            players:players

        },
      {withCredentials: true});
        if (response.status === 200){
            toast.success("Auction Developed Successfully");
            Navigate("/admin")
        }

    }catch(err){
        console.log(err)
        toast.error("Error in creating auction")
    }
  };



  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* STEP INDICATOR */}
        <div className="flex justify-between text-sm font-semibold">
          <span className={step === 1 ? "text-blue-600" : "text-gray-400"}>
            Auction
          </span>
          <span className={step === 2 ? "text-blue-600" : "text-gray-400"}>
            Franchises
          </span>
          <span className={step === 3 ? "text-blue-600" : "text-gray-400"}>
            Players
          </span>
        </div>

        {/* ================= STEP 1 : AUCTION ================= */}
        {step === 1 && (
          <div className="card">
            <h2 className="title">Create Auction</h2>

            <div className="grid md:grid-cols-3 gap-4">
              <input
                className="input"
                placeholder="Auction Name"
                value={auction.name}
                onChange={(e) =>
                  setAuction({ ...auction, name: e.target.value })
                }
              />

              <input
                type="datetime-local"
                className="input"
                value={auction.time}
                onChange={(e) =>
                  setAuction({ ...auction, time: e.target.value })
                }
              />

              <input
                type="number"
                className="input"
                placeholder="Player Bid Time (sec)"
                value={auction.playerTime}
                onChange={(e) =>
                  setAuction({ ...auction, playerTime: e.target.value })
                }
              />
              <textarea
                rows={3}
                cols={50}
                placeholder="Enter Auction Description"
                className="input"
                value = {auction.description}
                onChange={(e) => setAuction({...auction,description:e.target.value})}>
                
              </textarea>
              <input
                type = "text"
                className="input"
                placeholder="Short Name (e.g. IPL2024)"
                value={auction.shortName}
                onChange={(e) => setAuction({...auction,shortName:e.target.value})}
                />

                <input
                type = "text"
                className="input"
                placeholder="Auction Image URL"
                value={auction.auctionImg}
                onChange={(e) => setAuction({...auction,auctionImg:e.target.value})}
                />
            </div>

            <p className="text-sm text-gray-500 mt-2">
              ⏱ Same time applies to every player during auction
            </p>

            <div className="flex justify-end mt-6">
              <button className="btn-primary" onClick={() => {
                CreateAuction();
                setStep(2)}
                }>
                Next → Franchises
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2 : FRANCHISES ================= */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="title">Franchises</h2>
              <button className="btn-secondary" onClick={addFranchise}>
                + Add Franchise
              </button>
            </div>

            {franchises.map((f, index) => (
              <div key={f.id} className="card space-y-4">
                <h3 className="font-semibold text-gray-700">
                  Franchise {index + 1}
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    className="input"
                    placeholder="Team Name"
                    value={f.teamName}
                    onChange={(e) => {
                      const copy = [...franchises];
                      copy[index].teamName = e.target.value;
                      setFranchises(copy);
                    }}
                  />

                  <input
                    className="input"
                    placeholder="Purse Amount"
                    value={f.purse}
                    onChange={(e) => {
                      const copy = [...franchises];
                      copy[index].purse = e.target.value;
                      setFranchises(copy);
                    }}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="email"
                    className="input"
                    placeholder="Franchise Email"
                    value={f.email}
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
                    value={f.password}
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
          </div>
        )}

        {/* ================= STEP 3 : PLAYERS ================= */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="title">Players</h2>
              <button className="btn-secondary" onClick={addPlayer}>
                + Add Player
              </button>
            </div>

            {players.map((p, index) => (
              <div key={p.id} className="card space-y-4">
                <h3 className="font-semibold text-gray-700">
                  Player {index + 1}
                </h3>

                <div className="grid md:grid-cols-3 gap-3">
                  <input className="input" placeholder="Set No" />
                  <input className="input" placeholder="Player Name" />
                  <input className="input" placeholder="Country" />
                </div>

                <div className="grid md:grid-cols-3 gap-3">
                  <input className="input" placeholder="Batting Style" />
                  <input className="input" placeholder="Runs" />
                  <input className="input" placeholder="Average" />
                </div>

                <div className="grid md:grid-cols-3 gap-3">
                  <input className="input" placeholder="Strike Rate" />
                  <input className="input" placeholder="Fifties" />
                  <input className="input" placeholder="Hundreds" />
                </div>
              </div>
            ))}

            <div className="flex justify-between">
              <button className="btn-secondary" onClick={() => setStep(2)}>
                ← Back
              </button>
              <button className="btn-primary" onClick={DevelopAction}
            >
                ✅ Create Auction
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateAuction;
