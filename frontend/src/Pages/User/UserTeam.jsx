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
      state: team.players
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
      className="group rounded-2xl shadow-md hover:shadow-xl cursor-pointer bg-white border border-gray-200 overflow-hidden transition-all duration-300"
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
      }}
    >
      <div className="relative">
        <img
          src="https://images.unsplash.com/photo-1747134392471-831ea9a48e1e?q=80&w=2000&auto=format&fit=crop"
          alt="Team Banner"
          className="w-full h-48 object-cover group-hover:scale-105 transition-all duration-300"
        />
      </div>

      <div className="px-5 py-4">
        <h3 className="text-lg font-bold text-gray-800 tracking-wide">
          {team.teamName}
        </h3>

        <div className="mt-2 flex justify-between items-center">
          <p className="text-sm text-gray-600">Purse:</p>
          <p className="text-sm font-semibold text-blue-600">{team.purse}</p>
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

      <div className="px-4 lg:px-12 mt-5">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Team Details
        </h1>

        {/* Responsive Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-3">
          {data.map((team) => (
            <TiltCard key={team._id} team={team} />
          ))}
        </div>

        {data.length === 0 && (
          <p className="text-gray-500 text-center py-10">
            No teams found for this auction.
          </p>
        )}
      </div>
    </div>
  );
};

export default UserTeam;
