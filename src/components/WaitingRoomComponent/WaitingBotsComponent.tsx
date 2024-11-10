import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useNavigate, useParams } from "react-router-dom";
import { cardTable, nullUserIcon } from "../../images";
import axios from "axios";
import useToast from "../../hooks/useToast";
import LoadingComponent from "../LoadingComponent";
import WarningModal from "../WaningModal";

const WaitingBotsComponent: React.FC = () => {
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
  const [showWarning, setShowWarning] = useState(false); // Uyarı modal durumu

  const [countdown, setCountdown] = useState<number | null>(null);
  const [allReady, setAllReady] = useState(false);
  const [isReady, setIsReady] = useState(false); // Kullanıcının hazır durumu

  const salonIdNumber = Number(salon_id);
  const tableIdNumber = Number(table_id);

  const salon = salons.find((salon) => salon.salon_id === salonIdNumber);
  const table = salon?.tables.find((table) => table.table_id === tableIdNumber);

  const handleLeaveTable = async () => {
    if (telegram_id) {
      try {
        await axios.post(
          `https://winroller.muzmanlive.com/salons/${salon_id}/tables/${table_id}/leave_bot`,
          { telegram_id }
        );
        navigate(`/saloon`);
      } catch (er) {
        console.error("Error leaving the table:", er);
      }
    } else {
      console.error("User ID not found!");
    }
  };

  const handleReady = async () => {
    if (telegram_id) {
      try {
        await axios.post(
          `https://winroller.muzmanlive.com/salons/${salon_id}/tables/${table_id}/ready_bots`,
          { telegram_id }
        );
        setIsReady(true); // Kullanıcı hazır durumuna geçti
        success(
          "You are ready! The game will start when the other players are ready."
        );
      } catch (e) {
        console.error("Error reporting readiness:", e);
        error("You do not have the game pass, please buy it.");
      }
    } else {
      console.error("User ID not found!");
    }
  };

  useEffect(() => {
    if (table?.players.length === 4) {
      const allPlayersReady = table.players.every((player) => player.has_paid);
      setAllReady(allPlayersReady);
    } else {
      setAllReady(false);
    }
  }, [table]);

  useEffect(() => {
    if (allReady && countdown === null) {
      setCountdown(5);
    }
    if (countdown !== null && countdown > 0) {
      const timer = window.setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      navigate(`/game/${salon_id}/${table_id}/game-room-bots`);
    }
  }, [allReady, countdown, navigate, salon_id, table_id]);

  useEffect(() => {
    const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = ""; // Bazı tarayıcılarda kullanıcıyı uyarır

      // Kullanıcı hazır durumdaysa `handleLeaveTable` çağrılır
      if (isReady) {
        setShowWarning(true); // Uyarı modalını aç
        await handleLeaveTable();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isReady]);

  const confirmLeave = () => {
    setShowWarning(false);
    window.location.reload(); // Sayfayı yenile
  };

  const cancelLeave = () => {
    setShowWarning(false); // Uyarıyı kapat
  };

  if (!table) {
    return <LoadingComponent />;
  }

  const currentPlayer = table.players.find(
    (player) => player.player_id === telegram_id
  );

  const players = table.players
    .filter((player) => player.player_id !== telegram_id)
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
      {showWarning && (
        <WarningModal
          message="You have marked yourself as ready. If you leave, your game pass may be wasted. Are you sure you want to leave?"
          onConfirm={confirmLeave}
          onCancel={cancelLeave}
        />
      )}
      <div className="w-full h-12 bg-[#5e1f1f] flex items-center justify-center rounded-md shadow-md">
        <h1 className="text-yellow-400 text-lg font-semibold">Waiting Room</h1>
      </div>

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
              <span className="text-white">Waiting Players...</span>
            </div>
          </div>
        )}
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

export default WaitingBotsComponent;
