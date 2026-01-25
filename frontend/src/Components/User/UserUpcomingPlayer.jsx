import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { socket } from "../../Socket/socket";

const DOMAIN = import.meta.env.VITE_DOMAIN;

const UserUpcomingPlayer = ({ auctionId }) => {
  const [upcomingData, setUpcomingData] = useState([]);
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
    }
  };

  useEffect(() => {
    fetchedData();

    socket.on("upcomingPlayer-error", () => {
      console.log("User: upcomingPlayer socket error");
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
    navigate(`/auction/user/player/${player?._id}`, {
      state: player,
    });
  };

  return (
    <div className="min-w-screen flex flex-col px-4 py-4">
      <h2 className="text-lg md:text-xl font-semibold mb-3 tracking-wide text-slate-800">
        Upcoming Players
      </h2>

      {upcomingData?.length > 0 ? (
        <div className="min-w-screen">
          <Swiper
            spaceBetween={20}
            breakpoints={{
              0: { slidesPerView: 2 },
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 6 },
            }}
          >
            {upcomingData.map((player) => (
              <SwiperSlide key={player?.playerId ?? player?._id}>
                <div
                  onClick={() => getNavigate(player)}
                  className="flex flex-col items-center p-3 rounded-lg bg-white shadow-sm border border-slate-200 hover:shadow-md hover:-translate-y-1 transition cursor-pointer select-none min-w-[130px]"
                >
                  <img
                    src={player?.imageUrl ?? "/placeholder-player.png"}
                    className="h-24 w-24 rounded-full object-cover ring-1 ring-slate-200 mb-2"
                    alt={player?.name ?? "player"}
                  />
                  <p className="font-medium text-sm md:text-base text-slate-800">
                    {player?.name ?? "Unknown"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {player?.role ?? "—"}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <p className="text-slate-500 text-sm">No upcoming players yet...</p>
      )}
    </div>
  );
};

export default UserUpcomingPlayer;
