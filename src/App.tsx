import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchUser } from "./store/thunks/fetchUser";
import { AppDispatch } from "./store";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Saloon from "./pages/Saloon";
import Setting from "./pages/Setting";
import WaitingRoom from "./pages/WaitingRoom";
import GameRoom from "./pages/GameRoom";
import Tasks from "./pages/Tasks";
import Market from "./pages/Market";
import { useTelegram } from "./context/TelegramContext";
import LoadingComponent from "./components/LoadingComponent";
import WaitingRoomBot from "./pages/WaitingRoomBot";
import GameRoomBots from "./pages/GameRoomBots";
import { fetchLeaderboard } from "./store/thunks/fetchLeaderboard";
import Farm from "./pages/Farm";

function App() {
  const dispatch = useDispatch<AppDispatch>(); // dispatch'i AppDispatch olarak tipliyoruz

  // staticUser değişkeni
  // const staticUser = {
  //   telegram_id: 313131, // Zorunlu alan
  //   first_name: "John", // İsteğe bağlı
  //   last_name: "Doe", // İsteğe bağlı
  //   username: "johndoe", // İsteğe bağlı
  //   photo_url: "https://example.com/photo.jpg", // İsteğe bağlı
  //   language_code: "en", // İsteğe bağlı
  // };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const result = await dispatch(fetchUser(staticUser)); // async dispatch
  //     await dispatch(fetchLeaderboard());
  //     console.log(result);
  //   };

  //   fetchData(); // Fetch user'ı çağır
  // }, [dispatch]);

  const { telegramUser } = useTelegram();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (telegramUser) {
        setIsLoading(true); // Başlangıçta yükleme durumunu true yap
        await dispatch(fetchUser(telegramUser));
        await dispatch(fetchLeaderboard());

        setIsLoading(false); // Veriler yüklendikten sonra false yap
      }
    };

    fetchData();
  }, [dispatch, telegramUser]);

  if (isLoading || !telegramUser) {
    return <LoadingComponent />; // Yükleyici göster
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route path="/saloon" element={<Saloon />} />
        <Route path="/farm" element={<Farm />} />
        <Route path="/settings" element={<Setting />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/market" element={<Market />} />
        <Route
          path="/salon/:salon_id/table/:table_id/waiting-room"
          element={<WaitingRoom />}
        />
        <Route
          path="/salon/:salon_id/table/:table_id/waiting-room-bot"
          element={<WaitingRoomBot />}
        />
        <Route
          path="/game/:salon_id/:table_id/game-room"
          element={<GameRoom />}
        />
        <Route
          path="/game/:salon_id/:table_id/game-room-bots"
          element={<GameRoomBots />}
        />
      </Routes>
    </Router>
  );
}

export default App;
