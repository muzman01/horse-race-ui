import { FaMedal, FaShieldAlt, FaTrophy, FaCoins, FaGem } from "react-icons/fa";
import TableComponent from "./TableComponent";
import { Salon } from "../../types/salon";
import { gamePassIcon } from "../../images";

interface SalonProps {
  salon: Salon;
}

const SalonComponent: React.FC<SalonProps> = ({ salon }) => {
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
        return "%20";
      case 2:
        return "%15";
      case 3:
        return "%10";
      case 4:
        return "%5";
      case 5:
        return "%2";
      case 6:
        return "%1";
      default:
        return "%0";
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
          Game Fee: {getGameFee(salon.salon_id)}
        </div>
      </div>

      <div className="flex flex-row gap-1">
        <p className="text-gray-400 mb-4">Enter Fee: {salon.entry_fee} </p>
        <img src={gamePassIcon} alt="gamepass" className="w-6 h-6" />
      </div>
      {/* Masaları listeleme */}
      <div className="flex overflow-x-auto gap-4 p-2">
        {salon.tables.map((table) => (
          <TableComponent
            key={table.table_id}
            table={table}
            salon_id={salon.salon_id} // Salon ID'sini TableComponent'e geçiriyoruz
          />
        ))}
      </div>
    </div>
  );
};

export default SalonComponent;
