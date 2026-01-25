import React, { useEffect, useState } from "react";
import NavBar from "../../Components/Common/NavBar";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DOMAIN = import.meta.env.VITE_DOMAIN;

const TiltCard = ({ team }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const threshold = 20;
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/user/teams/player/${team._id}`, {
      state: team.players,
    });
  };

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -threshold, y: x * threshold });
  };

  return (
    <div
      onClick={handleNavigate}
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className="group rounded-2xl backdrop-blur-md bg-white/70 border border-white/50 shadow-md hover:shadow-xl cursor-pointer overflow-hidden transition-all duration-300"
      style={{
        transform: `perspective(1100px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
    >
      <div className="relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1747134392471-831ea9a48e1e?q=80&w=2000"
          alt="Team Banner"
          className="w-full h-48 object-cover group-hover:scale-110 transition-all duration-400"
        />
      </div>

      <div className="px-5 py-4">
        <h3 className="text-lg font-bold text-slate-800 tracking-wide">
          {team.teamName}
        </h3>

        <div className="mt-2 flex justify-between items-center text-[14px]">
          <span className="text-slate-600">Purse</span>
          <span className="font-semibold text-blue-600">
            ₹{team.purse?.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

const UserTeam = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const auctionId = localStorage.getItem("auctionId");

      const response = await axios.post(
        DOMAIN + "/auction/get-teams",
        { auctionId },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setData(response.data.data);
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">

      <NavBar />

      {/* HEADER */}
      <div className="w-full py-6 px-5 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500">
        <h1 className="text-2xl font-semibold text-white tracking-wide">
          Auction Teams
        </h1>
        <p className="text-white/80 text-sm mt-1">
          View purse details & team players
        </p>
      </div>

      {/* GRID LIST */}
      <div className="px-5 lg:px-12 py-6">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.map((team) => (
            <TiltCard key={team._id} team={team} />
          ))}
        </div>

        {data.length === 0 && (
          <p className="text-slate-500 text-center py-10">
            No teams found for this auction.
          </p>
        )}
      </div>
    </div>
  );
};

export default UserTeam;
