import { useEffect } from "react";
import ErrorBoundary from "../ErrorBoundary";
import BottomNav from "../components/BottomNav";
import { useTelegram } from "../context/TelegramContext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchSalons } from "../store/thunks/fetchSalons";
import { WebSocketProvider } from "../context/WebSocketContext"; // WebSocketProvider'ı ekledik
import GameRoomComponent from "../components/GameRoomComponent";

const GameRoom = () => {
  const { showBackButton } = useTelegram();
  const dispatch = useDispatch<AppDispatch>();
  const telegram_id = useSelector(
    (state: RootState) => state?.user?.user?.telegram_id || 0
  );

  useEffect(() => {
    showBackButton(); // Geri butonunu göster
  }, [showBackButton]);

  useEffect(() => {
    dispatch(fetchSalons()); // Salonları API'den çekiyoruz
  }, [dispatch]);

  return (
    <WebSocketProvider telegram_id={telegram_id}>
      <div>
        <div className="flex flex-col justify-between overflow-x-hidden">
          <ErrorBoundary>
            <div className="max-h-[calc(100vh-80px)] overflow-y-auto">
              <GameRoomComponent />
            </div>
          </ErrorBoundary>
        </div>
        <div className="fixed bottom-0 w-full">
          <BottomNav />
        </div>
      </div>
    </WebSocketProvider>
  );
};

export default GameRoom;
