import React, { useState } from "react";
import { useSelector } from "react-redux";
import { kurpiyerIcon } from "../../images";
import { Table } from "../../types/salon";
import { RootState } from "../../store";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useToast from "../../hooks/useToast";
import { BarLoader, BounceLoader } from "react-spinners";
import { useTelegram } from "../../context/TelegramContext";

interface SpecialTableProps {
  table: Table;
  salon_id: number;
}

const SpecialTableComponent: React.FC<SpecialTableProps> = ({
  table,
  salon_id,
}) => {
  const telegram_id = useSelector(
    (state: RootState) => state?.user?.user?.telegram_id
  );
  const navigate = useNavigate();
  const { handleVibrate } = useTelegram();
  const { warning } = useToast();
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (telegram_id) {
      handleVibrate();
      setLoading(true);
      try {
        await axios.post(
          `https://winroller.muzmanlive.com/salons/${salon_id}/tables/${table.table_id}/join_with_bots`,
          {
            telegram_id: telegram_id,
          }
        );

        navigate(`/salon/${salon_id}/table/${table.table_id}/waiting-room-bot`);
        setLoading(false);
      } catch (error) {
        console.error("Masaya katılırken hata oluştu:", error);
        warning("Error joining the table with bots.");
        setLoading(false);
      }
    } else {
      setLoading(false);
      console.error("Kullanıcı ID'si bulunamadı!");
    }
  };

  const isTableFull = table.players.length > 0; // Masa dolu mu kontrolü

  return (
    <div
      className="bg-green-700 p-6 rounded-lg w-full max-w-sm flex flex-col items-center shadow-lg relative min-w-[300px] min-h-[250px]"
      style={{
        background: "linear-gradient(145deg, #78b982, #3e704d)",
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
        {isTableFull ? (
          <span className="text-[#c25918]">Table Full</span>
        ) : (
          <span className="text-green-700">Avaible</span>
        )}
      </div>
      {isTableFull && (
        <div className="text-center text-sm text-[#c25918] flex flex-col items-center gap-2 mb-4">
          <span> Waiting for the table to become available...</span>
          <BarLoader />
        </div>
      )}

      {/* Start Butonu - Masa doluysa gösterme */}
      {!isTableFull && (
        <button
          className="bg-[#c25918] text-white rounded-md px-6 py-2 text-sm whitespace-nowrap"
          onClick={handleStart}
          disabled={loading}
        >
          {loading ? <BounceLoader color="#9b968f" size={20} /> : "Start"}
        </button>
      )}
    </div>
  );
};

export default SpecialTableComponent;
