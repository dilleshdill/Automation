import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { socket } from "../../Socket/socket";

const DOMAIN = import.meta.env.VITE_DOMAIN;

const BidderUpcomingPlayer = ({ auctionId }) => {
  const [upcomingData, setUpcomingData] = useState([]);
  const navigate = useNavigate();

  const fetchedData = async () => {
    try {
      const res = await axios.get(
        `${DOMAIN}/bidder/upcoming-players?auctionId=${auctionId}`,
        { withCredentials: true }
      );

      if (res.status === 200) {
        setUpcomingData(res?.data?.data ?? []);
      }
    } catch (err) {
      console.log("UpcomingPlayer Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchedData();

    socket.on("upcomingPlayer-error", () => {
      console.log("Socket: Upcoming player error");
    });

    socket.on("upcomingPlayer-success", (playerList) => {
      setUpcomingData(playerList ?? []);
    });

    return () => {
      socket.off("upcomingPlayer-error");
      socket.off("upcomingPlayer-success");
    };
  }, []);

  const getNavigate = (player) => {
    navigate(`/auction/bidder/player/${player?._id}`, {
      state: player,
    });
  };

  return (
    <div className="min-w-screen flex flex-col px-4 py-4 md:px-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg md:text-xl font-semibold tracking-wide text-slate-800">
          Upcoming Players
        </h2>
      </div>

      {upcomingData?.length > 0 ? (
        <div className="min-w-screen">
          <Swiper
            spaceBetween={18}
            breakpoints={{
              0: { slidesPerView: 2.3 },
              480: { slidesPerView: 3 },
              640: { slidesPerView: 4 },
              768: { slidesPerView: 5 },
              1024: { slidesPerView: 6 },
            }}
          >
            {upcomingData.map((player) => (
              <SwiperSlide key={player?.playerId ?? player?._id}>
                <div
                  onClick={() => getNavigate(player)}
                  className="flex flex-col items-center bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all hover:-translate-y-[3px] cursor-pointer select-none"
                >
                  <img
                    src={player?.imageUrl ?? "/placeholder-player.png"}
                    alt={player?.name ?? "player"}
                    className="h-24 w-24 md:h-28 md:w-28 rounded-full object-cover ring-2 ring-slate-200 mb-2"
                  />

                  <div className="text-center">
                    <p className="font-medium text-[14px] md:text-[15px] text-slate-800 leading-tight">
                      {player?.name ?? "Unknown Player"}
                    </p>

                    <p className="text-xs text-slate-500 mt-[2px] uppercase tracking-wide">
                      {player?.role ?? "—"}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <div className="text-center py-4 text-slate-500 text-sm">
          No upcoming players yet...
        </div>
      )}
    </div>
  );
};

export default BidderUpcomingPlayer;
