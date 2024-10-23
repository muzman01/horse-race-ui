import { useEffect } from "react";
import HomeContainer from "../components/Home/HomeContainer";
import { useTelegram } from "../context/TelegramContext";

import ErrorBoundary from "../ErrorBoundary";

const Home = () => {
  const { hideBackButton } = useTelegram();

  useEffect(() => {
    hideBackButton(); // Ana sayfada geri butonunu gizle
  }, [hideBackButton]);
  return (
    <div className="flex flex-col justify-between">
      <ErrorBoundary>
        <HomeContainer />
      </ErrorBoundary>
    </div>
  );
};

export default Home;
