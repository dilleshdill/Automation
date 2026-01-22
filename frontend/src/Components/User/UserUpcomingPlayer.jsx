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
      const response = await axios.get(
        `${DOMAIN}/auction/upcoming-players?auctionId=${auctionId}`,
      );
      if (response.status === 200) {
        setUpcomingData(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchedData();

    socket.on("upcomingPlayer-error", () => {
      console.log("something there is error in upcomingPlayer Socket");
    });

    socket.on("upcomingPlayer-success", (player) => {
      console.log(player);
      setUpcomingData(player);
    });
  }, []);

  const getNavigate = (player) => {
    console.log(player);
    navigate(`/auction/user/player/${player._id}`, {
      state: player,
    });
  };

  return (
    <div className="flex flex-col min-w-screen p-5">
      <h2 className="text-xl font-semibold mb-3">Upcoming Players</h2>

      {upcomingData.length > 0 ? (
        <div className="max-w-screen">
          <Swiper
            spaceBetween={30}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 5 },
            }}
          >
            {upcomingData.map((player) => (
              <SwiperSlide key={player.playerId}>
                <div
                  className="border rounded-lg p-3 flex flex-col items-center"
                  onClick={() => getNavigate(player)}
                >
                  <img
                    src={player.imageUrl}
                    className="h-32 w-32 rounded-full object-cover mb-2"
                  />
                  <p className="font-semibold">{player.name}</p>
                  <p className="text-sm text-gray-600">{player.role}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No upcoming players</p>
      )}
    </div>
  );
};

export default UserUpcomingPlayer;
