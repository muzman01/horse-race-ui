import { FaMedal, FaShieldAlt, FaTrophy, FaCoins, FaGem } from "react-icons/fa";
import TableComponent from "./TableComponent";
import SpecialTableComponent from "./SpecialTableComponent"; // Yeni bileşeni içe aktarın
import { Salon } from "../../types/salon";
import { gamePassIcon } from "../../images";
import { Tooltip } from "react-tooltip";

import { RxInfoCircled } from "react-icons/rx";
import { useTelegram } from "../../context/TelegramContext";

interface SalonProps {
  salon: Salon;
}

const SalonComponent: React.FC<SalonProps> = ({ salon }) => {
  const { handleVibrate } = useTelegram();
  const getSalonIcon = (name: string) => {
    switch (name) {
      case "Bronz":
        return <FaMedal className="text-orange-500 text-3xl" />;
      case "Silver":
        return <FaShieldAlt className="text-gray-300 text-3xl" />;
      case "Gold":
        return <FaTrophy className="text-yellow-400 text-3xl" />;
      case "Platinum":
        return <FaCoins className="text-blue-300 text-3xl" />;
      case "Diamond":
        return <FaGem className="text-blue-500 text-3xl" />;
      case "Master":
        return <FaShieldAlt className="text-purple-500 text-3xl" />;
      default:
        return <FaTrophy className="text-gray-400 text-3xl" />;
    }
  };

  const getGameFee = (salonId: number) => {
    switch (salonId) {
      case 1:
        return "400";
      case 2:
        return "1200";
      case 3:
        return "2000";
      case 4:
        return "4000";
      case 5:
        return "6000";
      case 6:
        return "10000";
      default:
        return "0";
    }
  };

  return (
    <div className="bg-[#212121] rounded-lg p-6 mb-6 shadow-lg relative">
      {/* Salon başlıkları ve ikon */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2">
          {getSalonIcon(salon.name)}
          <h2 className="text-white text-2xl font-bold">{salon.name}</h2>
        </div>

        <div className="flex items-center text-sm space-x-2 text-gray-400">
          Prize: {getGameFee(salon.salon_id)} $HP
        </div>
      </div>

      <div className="flex flex-row jus gap-1">
        {salon.salon_id === 0 ? (
          <div className="flex flex-row justify-cente gap-1 items-center">
            <p className="text-gray-400 mb-4">Welcome Bot Games </p>

            <RxInfoCircled
              onClick={handleVibrate}
              onMouseEnter={handleVibrate}
              className="-mt-3 text-gray-400 "
              data-tooltip-id="freegame-tooltip"
              data-tooltip-content="This game is played against bots and you cannot win any prizes at the end of the game."
            />

            <Tooltip
              id="freegame-tooltip"
              style={{
                backgroundColor: "white",
                color: "black",
                fontSize: "14px",
                border: "none",
                maxWidth: "200px",
                padding: "5px",
                borderRadius: "5px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)", // Gölge ekleme
              }}
            />
          </div>
        ) : (
          <>
            {" "}
            <p className="text-gray-400 mb-4">
              Game Pass Required: {salon.entry_fee}{" "}
            </p>
            <img src={gamePassIcon} alt="gamepass" className="w-6 h-6" />
          </>
        )}
      </div>

      {/* Masaları listeleme */}
      <div className="flex overflow-x-auto gap-4 p-2">
        {salon.tables.map((table) =>
          salon.salon_id === 0 ? (
            <SpecialTableComponent
              key={table.table_id}
              table={table}
              salon_id={salon.salon_id}
            />
          ) : (
            <TableComponent
              key={table.table_id}
              table={table}
              salon_id={salon.salon_id}
            />
          )
        )}
      </div>
    </div>
  );
};

export default SalonComponent;
