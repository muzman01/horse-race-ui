import { useEffect } from "react";
import ErrorBoundary from "../ErrorBoundary";
import BottomNav from "../components/BottomNav";
import { useTelegram } from "../context/TelegramContext";

import FarmComponent from "../components/FarmComponent";

const Farm = () => {
  const { showBackButton } = useTelegram();

  useEffect(() => {
    showBackButton(); // Geri butonunu göster
  }, [showBackButton]);

  return (
    <div>
      <div className="flex flex-col justify-between overflow-x-hidden">
        <ErrorBoundary>
          <div className="max-h-[calc(100vh-80px)] overflow-y-auto">
            <FarmComponent />
          </div>
        </ErrorBoundary>
      </div>
      <div className="fixed bottom-0 w-full">
        <BottomNav />
      </div>
    </div>
  );
};

export default Farm;