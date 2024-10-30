import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchUser } from "./store/thunks/fetchUser";
import { AppDispatch } from "./store";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Saloon from "./pages/Saloon";
import Cupon from "./pages/Cupon";
import Setting from "./pages/Setting";
import WaitingRoom from "./pages/WaitingRoom";
import GameRoom from "./pages/GameRoom";
import Tasks from "./pages/Tasks";
import Market from "./pages/Market";

function App() {
  const dispatch = useDispatch<AppDispatch>(); // dispatch'i AppDispatch olarak tipliyoruz

  // staticUser değişkeni
  const staticUser = {
    telegram_id: 313131, // Zorunlu alan
    first_name: "John", // İsteğe bağlı
    last_name: "Doe", // İsteğe bağlı
    username: "johndoe", // İsteğe bağlı
    photo_url: "https://example.com/photo.jpg", // İsteğe bağlı
    language_code: "en", // İsteğe bağlı
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await dispatch(fetchUser(staticUser)); // async dispatch
    };

    fetchData(); // Fetch user'ı çağır
  }, [dispatch]);

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
        <Route path="/coupon" element={<Cupon />} />
        <Route path="/settings" element={<Setting />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/market" element={<Market />} />
        <Route
          path="/salon/:salon_id/table/:table_id/waiting-room"
          element={<WaitingRoom />}
        />
        <Route
          path="/game/:salon_id/:table_id/game-room"
          element={<GameRoom />}
        />
      </Routes>
    </Router>
  );
}

export default App;
