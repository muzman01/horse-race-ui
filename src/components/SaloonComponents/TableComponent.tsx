import { useSelector } from "react-redux";
import { kurpiyerIcon, nullUserIcon } from "../../images";
import { Table } from "../../types/salon";
import { RootState } from "../../store";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useToast from "../../hooks/useToast";

interface TableProps {
  table: Table;
  salon_id: number;
}

const TableComponent: React.FC<TableProps> = ({ table, salon_id }) => {
  const telegram_id = useSelector(
    (state: RootState) => state?.user?.user?.telegram_id
  );
  const game_pass: any = useSelector(
    (state: RootState) => state?.user?.user?.game_pass
  ); // Kullanıcının game_pass bilgisini Redux'tan alıyoruz.
  const navigate = useNavigate();
  const { warning } = useToast();

  const gamePassRequirements: { [key: number]: number } = {
    1: 1,
    2: 3,
    3: 5,
    4: 10,
    5: 15,
  };

  const handleJoinTable = async (table_id: number) => {
    const requiredPass = gamePassRequirements[salon_id];

    if (game_pass < requiredPass) {
      warning("You do not have enough Game Passes.");
      return; // Yeterli pass yoksa işlemi durduruyoruz.
    }

    if (telegram_id) {
      try {
        await axios.post(
          `https://winroller.muzmanlive.com/salons/${salon_id}/tables/${table_id}/join`,
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
          `https://winroller.muzmanlive.com/salons/${salon_id}/tables/${table_id}/leave`,
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
      className="bg-[#5e1f1f] p-6 rounded-lg w-full max-w-sm flex flex-col items-center shadow-lg relative min-w-[300px] min-h-[250px]"
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
        {occupiedSeats === maxSeats ? "Full" : "Available"}
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
                      <div className="bg-gray-700 rounded-full p-2">
                        <img
                          src={nullUserIcon}
                          className="rounded-full w-6 h-6"
                        />
                      </div>
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

      {occupiedSeats > 0 && (
        <div className="px-4 py-2 text-yellow-400 rounded-md font-bold border border-[#5e1f1f] text-lg">
          Total Bet: {totalBet} TON
        </div>
      )}
    </div>
  );
};

export default TableComponent;
