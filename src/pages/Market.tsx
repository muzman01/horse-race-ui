import { useEffect } from "react";
import ErrorBoundary from "../ErrorBoundary";
import BottomNav from "../components/BottomNav";
import { useTelegram } from "../context/TelegramContext";

import MarketComponent from "../components/MarketComponent";
import { useDispatch } from "react-redux";
import { fetchMarket } from "../store/thunks/fetchMarket";
import { AppDispatch } from "../store";

const Market = () => {
  const { showBackButton } = useTelegram();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    showBackButton(); // Geri butonunu göster
  }, [showBackButton]);
  useEffect(() => {
    dispatch(fetchMarket()); // Salonları API'den çekiyoruz
  }, [dispatch]);
  return (
    <div>
      <div className="flex flex-col justify-between overflow-x-hidden">
        <ErrorBoundary>
          <div className="max-h-[calc(100vh-80px)] overflow-y-auto">
            <MarketComponent />
          </div>
        </ErrorBoundary>
      </div>
      <div className="fixed bottom-0 w-full">
        <BottomNav />
      </div>
    </div>
  );
};

export default Market;
