import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useNavigate, useParams } from "react-router-dom";
import { cardTable, nullUserIcon } from "../../images";
import axios from "axios";
import useToast from "../../hooks/useToast";
import LoadingComponent from "../LoadingComponent";

const WaitingRoomComponent: React.FC = () => {
  const { salon_id, table_id } = useParams<{
    salon_id: string;
    table_id: string;
  }>();
  const { salons } = useSelector((state: RootState) => state.salon);
  const telegram_id = useSelector(
    (state: RootState) => state?.user?.user?.telegram_id || 0
  );
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [countdown, setCountdown] = useState<number | null>(null);
  const [allReady, setAllReady] = useState(false); // Tüm kullanıcıların hazır olup olmadığını kontrol

  const salonIdNumber = Number(salon_id);
  const tableIdNumber = Number(table_id);

  const salon = salons.find((salon) => salon.salon_id === salonIdNumber);
  const table = salon?.tables.find((table) => table.table_id === tableIdNumber);

  // Eğer tablo bulunamazsa, bir hata mesajı döndür.

  // Masadan ayrılma fonksiyonu
  const handleLeaveTable = async () => {
    if (telegram_id) {
      try {
        await axios.post(
          `https://winroller.muzmanlive.com/salons/${salon_id}/tables/${table_id}/leave`,
          { telegram_id }
        );
        navigate(`/saloon`);
      } catch (er) {}
    } else {
      console.error("Kullanıcı ID'si bulunamadı!");
    }
  };

  // Ready butonuna tıklama fonksiyonu (oyuncunun hazır olduğunu bildiren fonksiyon)
  const handleReady = async () => {
    if (telegram_id) {
      try {
        await axios.post(
          `https://winroller.muzmanlive.com/salons/${salon_id}/tables/${table_id}/ready`,
          { telegram_id }
        );
        success(
          "You are ready! The game will start when the other players are ready."
        );
      } catch (e) {
        console.error("Hazır olma durumunu bildirirken hata oluştu:", e);
        error("You do not have the game pass, please buy it");
      }
    } else {
      console.error("Kullanıcı ID'si bulunamadı!");
    }
  };

  // Tüm oyuncuların hazır olup olmadığını kontrol eden Hook
  useEffect(() => {
    // İlk olarak players.length === 4 olduğundan emin olalım
    if (table?.players.length === 4) {
      // Eğer tüm oyuncuların has_paid durumu true ise geri sayımı başlatabiliriz
      const allPlayersReady = table.players.every((player) => player.has_paid);

      if (allPlayersReady) {
        setAllReady(true);
      } else {
        setAllReady(false); // Eğer bir oyuncu hazır değilse geri sayım başlamamalı
      }
    } else {
      setAllReady(false); // Oyuncu sayısı 4 değilse, geri sayım başlamamalı
    }
  }, [table]);

  // Geri sayım ve yönlendirme Hook'u
  useEffect(() => {
    if (allReady && countdown === null) {
      setCountdown(5); // 5 saniyelik geri sayım başlat
    }
    if (countdown !== null && countdown > 0) {
      const timer = window.setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      navigate(`/game/${salon_id}/${table_id}/game-room`);
    }
  }, [allReady, countdown, navigate, salon_id, table_id]);
  if (!table) {
    return <LoadingComponent />;
  }

  // Kullanıcının kendisini bul
  const currentPlayer = table.players.find(
    (player) => player.player_id === telegram_id
  );
  // Sadece diğer oyuncuları (sen hariç) göstereceğiz
  const players = table.players
    .filter((player) => player.player_id !== telegram_id) // Kendi oyuncu ID'ni filtrele
    .map((player, idx) => ({
      player_id: player.player_id,
      name: `Horse ${idx + 1}`,
      has_paid: player.has_paid,
    }));
  const occupiedSeats = table.players.filter(
    (player) => player.has_paid
  ).length;
  const totalBet = occupiedSeats * table.bet_amount;

  return (
    <div className="flex flex-col items-center gap-4 min-h-screen p-4 bg-gray-900">
      {/* Header Alanı */}
      <div className="w-full h-12 bg-[#5e1f1f] flex items-center justify-center rounded-md shadow-md">
        <h1 className="text-yellow-400 text-lg font-semibold">Waiting Room</h1>
      </div>

      {/* Oyun Alanı */}
      <div className="relative w-full mt-4 p-6 bg-[#5e1f1f] rounded-md border border-gray-700 shadow-md flex justify-center items-center">
        <div
          className="w-full h-[400px] bg-cover bg-center rounded-md"
          style={{
            backgroundImage: `url(${cardTable})`,
            backgroundPosition: "center",
            backgroundSize: "150%",
            border: "2px solid #DCDCDC",
          }}
        >
          {/* Diğer oyuncuları Masanın Dört Yanına Yerleştiriyoruz */}
          {players.map((player, index) => {
            const positionStyles =
              index === 0
                ? "top-2 left-1/2 transform -translate-x-1/2"
                : index === 1
                ? "left-2 top-1/2 transform -translate-y-1/2"
                : index === 2
                ? "right-2 top-1/2 transform -translate-y-1/2"
                : "bottom-2 left-1/2 transform -translate-x-1/2";

            return (
              <div
                key={index}
                className={`absolute text-yellow-500 font-bold flex flex-col items-center justify-center gap-1 ${positionStyles}`}
              >
                <div className="bg-gray-700 rounded-full p-2">
                  <img src={nullUserIcon} className="rounded-full w-12 h-12" />
                </div>
                {player.name}
                <span
                  className={`${
                    player.has_paid ? "text-green-400" : "text-yellow-400"
                  }`}
                >
                  {player.has_paid ? "Ready" : "Waiting"}
                </span>
              </div>
            );
          })}

          {/* Sadece aktif oyuncu (kullanıcı) için Ready ve Leave butonları */}
          {currentPlayer && !currentPlayer.has_paid ? (
            <div className="absolute z-10 flex items-center justify-center gap-1 bottom-2 left-1/2 transform -translate-x-1/2 text-white">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-md"
                onClick={handleReady}
              >
                Ready
              </button>
              <button
                onClick={handleLeaveTable}
                className="bg-[#f5a623] text-white px-4 py-2 rounded-md"
              >
                Leave
              </button>
            </div>
          ) : (
            // Eğer oyuncu hazırsa sadece "Ready" yazısı gösterilsin
            <div className="absolute z-10 bottom-2 left-1/2 transform -translate-x-1/2 text-green-400 text-lg font-bold">
              Ready
            </div>
          )}
        </div>
        {countdown === null && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-[#5e1f1f] bg-opacity-90 p-4 rounded-lg border border-gray-700 flex flex-col items-center">
              <span className="text-lg text-yellow-400 font-bold">
                Total Bet: {totalBet} TON
              </span>
              <span className="text-white">Waiting Players..</span>
            </div>
          </div>
        )}

        {/* Masanın Ortasında Geri Sayım */}
        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-[#5e1f1f] bg-opacity-90 p-4 rounded-lg border border-gray-700 flex flex-col items-center">
              <span className="text-lg text-yellow-400 font-bold">
                Total Bet: {totalBet} TON
              </span>
              <span className="text-white">
                Game starts in: {countdown} seconds
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitingRoomComponent;
