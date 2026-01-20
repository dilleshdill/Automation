import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AdminNavBar from "../../Components/AdminComponent/AdminNavBar";

const DOMAIN = import.meta.env.VITE_DOMAIN;

const AuctionAdminPage = () => {
  const [auction, setAuction] = useState({});
  const location = useLocation();
  const { id } = location.state || {};
  const [showPlayerModal,setShowPlayerModal] = useState(false)
  const [showFranchsisModel,setShowFranchsisModal] = useState(false)

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const response = await axios.post(
          DOMAIN + "/auction/get-auction",
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
        setNo: 0,
        name: "",
        country: "",
        battingStyle: "",
        runs: 0,
        average: 0,
        strikeRate: 0,
        fifties: 0,
        hundreds: 0,
        basePrice:0,
        imageUrl:""
      },
    ]);
  };

  const getPassPlayer = async() => {
    
    try{
      const response = await axios.post(DOMAIN + "/add-player",
        {
          auctionId:id,
          players
        },
      {withCredentials: true}
      )
      if (response.status === 200){
        console.log(response.data)
        setShowPlayerModal(false)
      }
      }catch(err){
        console.log(err)
      }
  }

  const getPassFranchsis = async() => { 
    try{
      const response = await axios.post(DOMAIN + "/bidder/add-franchsis",
        { auctionId:id,
          franchises
        },
        { withCredentials: true }
      )
      if (response.status === 200){
        console.log(response.data)
        setShowFranchsisModal(false)
      }
    }catch(err){
      console.log(err)

    }
  }

  return (
    <>
      <AdminNavBar />

      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          
       
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

           
            <div className="flex justify-center items-start">
              <img
                src={auction.img}
                alt={auction.auction_name}
                className="w-72 h-80 object-cover rounded-xl shadow-md"
              />
            </div>

            {/* DETAILS SECTION */}
            <div className="lg:col-span-1 flex flex-col">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">
                {auction.auction_name}
              </h1>

              <div className="space-y-4 text-lg">
                <Info label="Status" value={auction.status} />
                <Info label="Player Time (sec)" value={auction.auction_time} />
                <Info label="Short Name" value={auction.shorts} />
                <Info label="Description" value={auction.description} />
              </div>
            </div>

            {/* ACTION PANEL */}
            <div className="flex flex-col gap-6 justify-start lg:mt-16">
              <button
                className="
                  flex items-center justify-center gap-3
                  px-6 py-3
                  rounded-xl
                  bg-gradient-to-r from-blue-600 to-indigo-600
                  text-white font-semibold
                  shadow-md
                  hover:scale-105 hover:shadow-lg
                  transition-all
                "
                onClick={()=>setShowPlayerModal(true)}
              >
                <span className="text-lg">➕</span>
                Add Player
              </button>

              <button
                className="
                  flex items-center justify-center gap-3
                  px-6 py-3
                  rounded-xl
                  bg-gradient-to-r from-green-600 to-emerald-600
                  text-white font-semibold
                  shadow-md
                  hover:scale-105 hover:shadow-lg
                  transition-all
                "
                onClick={()=>{setShowFranchsisModal(true)}}
              >
                <span className="text-lg">🏏</span>
                Add Franchise Logo
              </button>
            </div>

          </div>
        </div>

       {
       showPlayerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            
            <div className="bg-white w-full max-w-5xl rounded-xl shadow-lg p-6 overflow-y-auto max-h-[90vh]">

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Players</h2>
                <button
                  onClick={() => setShowPlayerModal(false)}
                  className="text-xl font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="flex justify-end mb-4">
                <button className="btn-secondary" onClick={addPlayer}>
                  + Add Player
                </button>
              </div>

              {players.map((p, index) => (
                <div key={p.id} className="card space-y-4 mb-6">
                  <h3 className="font-semibold text-gray-700">
                    Player {index + 1}
                  </h3>

                  <div className="grid md:grid-cols-3 gap-3">
                    <input
                      className="input"
                      placeholder="Set No"
                      value={p.setNo}
                      onChange={(e) => {
                        const copy = [...players];
                        copy[index].setNo = e.target.value;
                        setPlayers(copy);
                      }}
                    />

                    <input
                      className="input"
                      placeholder="Player Name"
                      value={p.name}
                      onChange={(e) => {
                        const copy = [...players];
                        copy[index].name = e.target.value;
                        setPlayers(copy);
                      }}
                    />

                    <input
                      className="input"
                      placeholder="Country"
                      value={p.country}
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
                      value={p.battingStyle}
                      onChange={(e) => {
                        const copy = [...players];
                        copy[index].battingStyle = e.target.value;
                        setPlayers(copy);
                      }}
                    />

                    <input
                      className="input"
                      placeholder="Runs"
                      value={p.runs}
                      onChange={(e) => {
                        const copy = [...players];
                        copy[index].runs = e.target.value;
                        setPlayers(copy);
                      }}
                    />

                    <input
                      className="input"
                      placeholder="Average"
                      value={p.average}
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
                      value={p.strikeRate}
                      onChange={(e) => {
                        const copy = [...players];
                        copy[index].strikeRate = e.target.value;
                        setPlayers(copy);
                      }}
                    />

                    <input
                      className="input"
                      placeholder="Fifties"
                      value={p.fifties}
                      onChange={(e) => {
                        const copy = [...players];
                        copy[index].fifties = e.target.value;
                        setPlayers(copy);
                      }}
                    />

                    <input
                      className="input"
                      placeholder="Hundreds"
                      value={p.hundreds}
                      onChange={(e) => {
                        const copy = [...players];
                        copy[index].hundreds = e.target.value;
                        setPlayers(copy);
                      }}
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-3">
                    <input
                      className="input"
                      placeholder="Base Price"
                      value={p.basePrice}
                      onChange={(e) => {
                        const copy = [...players];
                        copy[index].basePrice = e.target.value;
                        setPlayers(copy);
                      }}
                    />

                    <input
                      className="input"
                      placeholder="Image URL"
                      value={p.imageUrl}
                      onChange={(e) => {
                        const copy = [...players];
                        copy[index].imageUrl = e.target.value;
                        setPlayers(copy);
                      }}
                    />
                  </div>
                </div>
              ))}

              <div className="flex justify-end gap-4 mt-6">
                <button
                  className="btn-secondary"
                  onClick={() => setShowPlayerModal(false)}
                >
                  Cancel
                </button>
                <button className="btn-primary" onClick={getPassPlayer}>
                  Save Players
                </button>
              </div>

            </div>
          </div>
        )}


        {
          showFranchsisModel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            
            {/* MODAL BOX */}
            <div className="bg-white w-full max-w-5xl rounded-xl shadow-lg p-6 overflow-y-auto max-h-[90vh]">

              {/* MODAL HEADER */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Players</h2>
                <button
                  onClick={() => setShowFranchsisModal(false)}
                  className="text-xl font-bold"
                >
                  ✕
                </button>
              </div>
            
              <div className="space-y-4 z-50">
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

                <div className="flex justify-end gap-4 mt-6">
                <button
                  className="btn-secondary"
                  onClick={() => setShowFranchsisModal(false)}
                >
                  Cancel
                </button>
                <button className="btn-primary" onClick={getPassFranchsis
                }>
                  Save Franchsis
                </button>
              </div>
            </div>
          </div>
        </div>
          )
        }
      </div>
    </>
  );
};

const Info = ({ label, value }) => (
  <div className="flex justify-between items-start pb-3">
    <p className="font-medium text-gray-700">{label}</p>
    <p className="text-gray-500 text-right max-w-xs">
      {value || "-"}
    </p>
  </div>
);



export default AuctionAdminPage;
