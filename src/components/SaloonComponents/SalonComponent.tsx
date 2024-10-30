import { FiRefreshCcw } from "react-icons/fi";
import { FaMedal, FaShieldAlt, FaTrophy, FaCoins, FaGem } from "react-icons/fa";
import TableComponent from "./TableComponent";
import { Salon } from "../../types/salon";

interface SalonProps {
  salon: Salon;
}

const SalonComponent: React.FC<SalonProps> = ({ salon }) => {
  const getSalonIcon = (name: string) => {
    switch (name) {
      case "Bronz":
        return <FaMedal className="text-orange-400 text-3xl" />;
      case "Demir":
        return <FaShieldAlt className="text-gray-400 text-3xl" />;
      case "Silver":
        return <FaTrophy className="text-gray-300 text-3xl" />;
      case "Altın":
        return <FaCoins className="text-yellow-400 text-3xl" />;
      case "Elmas":
        return <FaGem className="text-blue-400 text-3xl" />;
      default:
        return <FaMedal className="text-gray-400 text-3xl" />;
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

        <div className="flex items-center space-x-2 text-gray-400">
          <FiRefreshCcw className="text-green-500" />
          <span className="text-sm"> 5sn ago</span>
        </div>
      </div>

      <p className="text-gray-400 mb-4">Enter Fee: {salon.entry_fee} TON</p>

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
