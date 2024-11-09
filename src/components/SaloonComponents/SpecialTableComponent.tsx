import React from "react";
import { useSelector } from "react-redux";
import { kurpiyerIcon, nullUserIcon } from "../../images";
import { Table } from "../../types/salon";
import { RootState } from "../../store";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useToast from "../../hooks/useToast";

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
  const { warning, success } = useToast();

  const handleStart = async () => {
    // Start butonuna tıklandığında `join_with_bots` endpoint'ine istek gönder
    if (telegram_id) {
      try {
        await axios.post(
          `http://localhost:8000/salons/${salon_id}/tables/${table.table_id}/join_with_bots`,
          {
            telegram_id: telegram_id,
          }
        );
        success("You and the bots have joined the table!");

        // Waiting Room ekranına yönlendir
        navigate(`/salon/${salon_id}/table/${table.table_id}/waiting-room-bot`);
      } catch (error) {
        console.error("Masaya katılırken hata oluştu:", error);
        warning("Error joining the table with bots.");
      }
    } else {
      console.error("Kullanıcı ID'si bulunamadı!");
    }
  };

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
        Avaible
      </div>

      {/* Start Butonu */}
      <button
        className="bg-[#c25918] text-white rounded-md px-6 py-2 text-sm whitespace-nowrap"
        onClick={handleStart}
      >
        Start
      </button>
    </div>
  );
};

export default SpecialTableComponent;
