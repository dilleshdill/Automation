import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { socket } from "../../Socket/socket";

const DOMAIN = import.meta.env.VITE_DOMAIN;

const UserUpcomingPlayer = ({ auctionId }) => {
  const [upcomingData, setUpcomingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchedData = async () => {
    try {
      const res = await axios.get(
        `${DOMAIN}/auction/upcoming-players?auctionId=${auctionId}`,
        { withCredentials: true }
      );

      if (res.status === 200) {
        setUpcomingData(res?.data?.data ?? []);
      }
    } catch (err) {
      console.log("UpcomingPlayer Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchedData();

    socket.on("upcomingPlayer-error", () => {
      console.log("User: upcomingPlayer socket error");
      setLoading(false);
    });

    socket.on("upcomingPlayer-success", (playerList) => {
      setUpcomingData(playerList ?? []);
      setLoading(false);
    });

    return () => {
      socket.off("upcomingPlayer-error");
      socket.off("upcomingPlayer-success");
    };
  }, []);

  const getNavigate = (player) => {
    navigate(`/auction/user/player/${player?._id}`, {
      state: player,
    });
  };

  // Get role color
  const getRoleColor = (role) => {
    const roles = {
      'batsman': 'text-blue-400',
      'bowler': 'text-green-400',
      'all-rounder': 'text-purple-400',
      'wicket-keeper': 'text-amber-400'
    };
    return roles[role?.toLowerCase()] || 'text-slate-400';
  };

  if (loading) {
    return (
      <div className="w-full px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-yellow-400 rounded-full"></span>
            Upcoming Players
          </h2>
        </div>
        <div className="grid grid-cols-6 gap-4">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-3 border border-white/10">
                <div className="h-24 w-24 mx-auto rounded-full bg-white/10"></div>
                <div className="h-4 w-20 mx-auto mt-2 bg-white/10 rounded"></div>
                <div className="h-3 w-16 mx-auto mt-1 bg-white/10 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-yellow-400 to-orange-400 rounded-full"></span>
          Upcoming Players
        </h2>
        <span className="text-xs text-white/50 bg-white/5 px-2 py-1 rounded-full border border-white/10">
          {upcomingData?.length || 0} players
        </span>
      </div>

      {upcomingData?.length > 0 ? (
        <div className="relative">
          <Swiper
            spaceBetween={16}
            breakpoints={{
              0: { slidesPerView: 2.2 },
              480: { slidesPerView: 3 },
              640: { slidesPerView: 4 },
              768: { slidesPerView: 5 },
              1024: { slidesPerView: 6 },
            }}
            className="!px-1"
          >
            {upcomingData.map((player) => {
              const roleColor = getRoleColor(player?.role);
              
              return (
                <SwiperSlide key={player?.playerId ?? player?._id}>
                  <div
                    onClick={() => getNavigate(player)}
                    className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 shadow-lg hover:shadow-2xl cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:border-yellow-500/30"
                  >
                    {/* Player Image */}
                    <div className="relative mb-3">
                      <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <img
                        src={player?.imageUrl ?? "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80"}
                        alt={player?.name ?? "player"}
                        className="h-24 w-24 md:h-28 md:w-28 mx-auto rounded-full object-cover ring-2 ring-white/20 group-hover:ring-yellow-400/50 transition-all"
                      />
                      
                      {/* Next Player Badge (optional - you can add logic) */}
                      {player?.isNext && (
                        <div className="absolute -top-1 -right-1 bg-green-500 rounded-full px-2 py-0.5">
                          <span className="text-white text-[8px] font-bold">NEXT</span>
                        </div>
                      )}
                    </div>

                    {/* Player Info */}
                    <div className="text-center">
                      <p className="font-bold text-white text-sm md:text-base line-clamp-1 group-hover:text-yellow-400 transition-colors">
                        {player?.name ?? "Unknown Player"}
                      </p>

                      <p className={`text-xs font-medium mt-1 uppercase tracking-wider ${roleColor}`}>
                        {player?.role ?? "—"}
                      </p>

                      {/* Base Price (optional) */}
                      {player?.basePrice && (
                        <p className="text-xs text-emerald-400 mt-2 font-mono">
                          ₹{player.basePrice.toLocaleString()}
                        </p>
                      )}
                    </div>

                    {/* View Details Indicator */}
                    <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="h-0.5 w-8 mx-auto bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"></div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Custom Navigation Arrows */}
          <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 z-10 hidden lg:block">
            <button className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/60 hover:text-white hover:bg-white/20 transition-all flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
          <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 z-10 hidden lg:block">
            <button className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/60 hover:text-white hover:bg-white/20 transition-all flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <div className="text-white/30 mb-3">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-white/70 font-medium">No upcoming players yet</p>
          <p className="text-white/40 text-sm mt-1">Check back soon for the next lineup</p>
        </div>
      )}
    </div>
  );
};

export default UserUpcomingPlayer;