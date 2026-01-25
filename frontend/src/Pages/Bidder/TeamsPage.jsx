import React, { useEffect, useState } from "react";
import BidderNavBar from "../../Components/BidderComponent/BidderNavBar";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DOMAIN = import.meta.env.VITE_DOMAIN;

const TiltCard = ({ team }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const threshold = 18;

  const handleNavigate = () => {
    navigate(`/auction/teams/${team?._id}`, {
      state: team?.players ?? [],
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
      className="
        rounded-xl bg-white border border-slate-200 shadow-md
        hover:shadow-lg transition-all cursor-pointer overflow-hidden
        max-w-[270px] w-full
      "
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.15s ease-out",
      }}
    >
      <img
        src={
          team?.logo ||
          "https://images.unsplash.com/photo-1508341591423-4347099e1f19?auto=format&fit=crop&w=800&q=60"
        }
        alt={team?.teamName}
        className="w-full h-40 object-cover"
      />

      <div className="px-4 py-3 space-y-1">
        {/* Team Name */}
        <h3 className="text-lg font-semibold text-slate-800 tracking-tight">
          {team?.teamName ?? "Team"}
        </h3>

        {/* Purse */}
        <p className="text-sm text-slate-600">
          Purse:{" "}
          <span className="font-semibold text-green-700">
            ₹{team?.purse?.toLocaleString() ?? 0}
          </span>
        </p>

        {/* Progress Bar (Remaining Purse Visual) */}
        <div className="w-full h-[6px] bg-slate-200 rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-green-500"
            style={{ width: `${Math.min((team?.purse / 10000000) * 100, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);

  const fetchTeams = async () => {
    try {
      const auctionId = localStorage.getItem("auctionId");

      const res = await axios.post(
        `${DOMAIN}/auction/get-teams`,
        { auctionId },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setTeams(res?.data?.data ?? []);
      }
    } catch (err) {
      toast.error("Failed to load teams");
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <div className="min-h-screen min-w-screen flex flex-col bg-[#f5f6fa]">
      <BidderNavBar />

      <div className="px-6 py-10 max-w-7xl w-full mx-auto">
        {/* Page Title */}
        <h2 className="text-[24px] font-semibold text-slate-700 tracking-tight mb-6">
          Auction Teams
        </h2>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 place-items-center">
          {teams.length > 0 ? (
            teams.map((team) => <TiltCard key={team?._id} team={team} />)
          ) : (
            <p className="text-slate-500 text-sm">No teams found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamsPage;
