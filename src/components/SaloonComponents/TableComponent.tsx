import { useSelector } from "react-redux";
import { kurpiyerIcon } from "../../images";
import { Table } from "../../types/salon";
import { RootState } from "../../store";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface TableProps {
  table: Table;
  salon_id: number;
}

const TableComponent: React.FC<TableProps> = ({ table, salon_id }) => {
  const telegram_id = useSelector(
    (state: RootState) => state?.user?.user?.telegram_id
  );
  const navigate = useNavigate();

  const handleJoinTable = async (table_id: number) => {
    if (telegram_id) {
      try {
        await axios.post(
          `http://localhost:8000/salons/${salon_id}/tables/${table_id}/join`,
          {
            telegram_id: telegram_id,
          }
        );
        navigate(`/salon/${salon_id}/table/${table_id}/waiting-room`);
      } catch (error) {
        console.error("Masaya katılırken hata oluştu:", error);
      }
    } else {
      console.error("Kullanıcı ID'si bulunamadı!");
    }
  };

  const handleLeaveTable = async (table_id: number) => {
    if (telegram_id) {
      try {
        await axios.post(
          `http://localhost:8000/salons/${salon_id}/tables/${table_id}/leave`,
          {
            telegram_id: telegram_id,
          }
        );
      } catch (error) {
        console.error("Masadan ayrılırken hata oluştu:", error);
      }
    } else {
      console.error("Kullanıcı ID'si bulunamadı!");
    }
  };

  const occupiedSeats = table.players.filter(
    (player) => player.player_id
  ).length;
  const maxSeats = 4;
  const emptySeats = maxSeats - occupiedSeats;

  // Masadaki oyuncu sayısı * bet_amount hesaplama
  const totalBet = occupiedSeats * table.bet_amount;

  return (
    <div
      className="bg-[#5e1f1f] p-6 rounded-lg w-full max-w-sm flex flex-col items-center shadow-lg relative min-w-[300px] min-h-[250px]" // min-height düzenlendi ve genişlik optimize edildi
      style={{
        background: "linear-gradient(145deg, #922f2f, #481111)",
        boxShadow:
          "8px 8px 20px rgba(0, 0, 0, 0.6), -8px -8px 20px rgba(255, 255, 255, 0.05)",
      }}
    >
      <img
        src={kurpiyerIcon}
        alt="Kurpiyer"
        className="absolute top-2 left-2 w-12 h-12"
      />

      <div className="text-center text-lg text-white mb-4 font-bold">
        Table {table.table_id}
      </div>

      <div className="flex justify-around w-full mb-4 space-x-4">
        {table.players.map((player, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center space-y-2"
          >
            {player.player_id ? (
              <>
                <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center">
                  {player.player_id === telegram_id ? (
                    <button
                      onClick={() => handleLeaveTable(table.table_id)}
                      className="bg-[#c25918] text-white rounded-full w-full h-full text-sm whitespace-nowrap"
                    >
                      Leave
                    </button>
                  ) : (
                    <span className="text-white text-xs truncate max-w-[50px]">
                      {player.player_id}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <button
                className="bg-[#c25918] text-white rounded-md px-4 py-2 text-xs"
                onClick={() => handleJoinTable(table.table_id)}
              >
                Join
              </button>
            )}
          </div>
        ))}

        {occupiedSeats > 0 &&
          emptySeats > 0 &&
          Array.from({ length: emptySeats }).map((_, idx) => (
            <button
              key={idx}
              className="bg-[#c25918] text-white rounded-md px-4 py-2 text-xs"
              onClick={() => handleJoinTable(table.table_id)}
            >
              Join
            </button>
          ))}
      </div>

      {occupiedSeats === 0 && (
        <button
          className="bg-[#c25918] text-white rounded-md px-6 py-2 text-sm whitespace-nowrap"
          onClick={() => handleJoinTable(table.table_id)}
        >
          Join Table
        </button>
      )}

      {occupiedSeats === maxSeats && (
        <div className="text-white font-bold text-lg">Masa Full</div>
      )}

      {occupiedSeats > 0 && (
        <div className="px-4 py-2 text-yellow-400 rounded-md font-bold border border-[#5e1f1f] text-lg">
          Total Bet: {totalBet} TON
        </div>
      )}
    </div>
  );
};

export default TableComponent;
