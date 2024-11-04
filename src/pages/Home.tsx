import { useEffect } from "react";
import HomeContainer from "../components/Home/HomeContainer";
import { useTelegram } from "../context/TelegramContext";
import { useSelector } from "react-redux";
import useWebSocket from "../hooks/useWebSocket"; // WebSocket hook'unu import et
import ErrorBoundary from "../ErrorBoundary";
import { RootState } from "../store"; // Redux store

const Home = () => {
  const { hideBackButton } = useTelegram();

  // Redux'tan telegram_id'yi alıyoruz
  const telegram_id = useSelector(
    (state: RootState) => state?.user?.user?.telegram_id
  );

  // WebSocket hook'u ile bağlantıyı başlatıyoruz
  const { sendMessage } = useWebSocket(telegram_id, (data) => {
    // Burada verileri işlemeyi de ekleyebilirsiniz
    console.log(data);
  });

  useEffect(() => {
    hideBackButton(); // Ana sayfada geri butonunu gizle
  }, [hideBackButton]);

  return (
    <div className="flex flex-col justify-between ">
      <div className="flex flex-col justify-between">
        <ErrorBoundary>
          {/* sendMessage fonksiyonunu HomeContainer'a prop olarak gönderiyoruz */}
          <HomeContainer sendMessage={sendMessage} />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default Home;
