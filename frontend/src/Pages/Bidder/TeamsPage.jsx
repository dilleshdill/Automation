import React, { useEffect, useState } from "react";
import AdminNavBar from "../../Components/AdminComponent/AdminNavBar";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const DOMAIN = import.meta.env.VITE_DOMAIN;



const TiltCard = ({ team }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const threshold = 20;
    const navigate = useNavigate()

    const getNavigate = (id,team) => {
    navigate(`/auction/teams/${id}`,{
        state:team.players
    })
  }
    

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -threshold, y: x * threshold });
  };

  return (
    <div
      className="rounded-xl shadow-xl overflow-hidden transition-transform duration-200 ease-out cursor-pointer max-w-80 bg-white"
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
      }}
      onClick={() => getNavigate(team._id,team)}
    >
      <img
        src="https://images.unsplash.com/photo-1747134392471-831ea9a48e1e?q=80&w=2000&auto=format&fit=crop"
        alt="City skyline"
        className="w-full h-52 object-cover"
      />

      <h3 className="mt-3 px-4 pt-3 mb-1 text-lg font-semibold text-gray-800">
        {team.teamName}
      </h3>
      <p className="text-sm px-4 pb-6 text-gray-600 w-5/6">
        Purse: {team.purse}
      </p>
    </div>
  );
};

const TeamsPage = () => {
  const [data, setData] = useState([]);

  const fetchedData = async () => {
    try {
      const auctionId = localStorage.getItem("auctionId");

      const response = await axios.post(
        DOMAIN + "/auction/get-teams",
        { auctionId },
        { withCredentials: true }
      );

      if (response.status === 200) {
        console.log(response.data.data)
        setData(response.data.data);
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.log(err);
    }
  };

  useEffect(() => {
    fetchedData();
  }, []);

  
  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavBar />
      <p className="text-xl font-semibold px-4 mt-4">Team Details</p>

      <div className="grid md:grid-cols-3 gap-6 p-6">
        {data.map((team) => (
          <TiltCard key={team._id} team={team} />
        ))}
      </div>
    </div>
  );
};

export default TeamsPage;
