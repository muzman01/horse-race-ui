import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
  useState,
} from "react";
import { updateSalons } from "../store/slices/salonSlice";
import { useDispatch } from "react-redux";

interface WebSocketContextType {
  sendMessage: (message: any) => void;
  salons: any[]; // Gelen salon verilerini tutacağımız alan
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export const WebSocketProvider: React.FC<{
  children: React.ReactNode;
  telegram_id: number;
}> = ({
  children,
  telegram_id, // Telegram ID'yi dışarıdan props olarak alıyoruz
}) => {
  const [salons, setSalons] = useState<any[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const pingIntervalRef = useRef<any | null>(null);
  const dispatch = useDispatch(); // Redux dispatch

  const connectWebSocket = useCallback(() => {
    try {
      const ws = new WebSocket("wss://winroller.muzmanlive.com/ws2");
      wsRef.current = ws;

      ws.onopen = () => {
        // Telegram ID ile bağlantıyı gönderiyoruz
        ws.send(
          JSON.stringify({
            action: "saloon", // 'saloon' action'ı ile salona bağlanıyoruz
            telegram_id, // Telegram ID'yi gönderiyoruz
          })
        );

        // Ping gönderme
        pingIntervalRef.current = setInterval(() => {
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ action: "ping" }));
          }
        }, 30000); // 30 saniye
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.salons) {
            setSalons(data.salons); // Salon verilerini güncelliyoruz
            dispatch(updateSalons(data.salons)); // Burada Redux state güncelleniyor
          }
        } catch (err) {
          console.error("Mesaj parse edilemedi:", err);
        }
      };

      ws.onclose = (event) => {
        wsRef.current = null;
        console.log(event);

        clearInterval(pingIntervalRef.current);
      };

      ws.onerror = (error) => {
        console.error("WebSocket Hatası:", error);
      };
    } catch (e) {
      console.error("WebSocket bağlantısı başlatılamadı:", e);
    }
  }, [telegram_id]);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
    };
  }, [connectWebSocket]);

  const sendMessage = (message: any) => {
    if (wsRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(message));
      } else {
        console.error(
          "WebSocket bağlantısı açık değil. Durum:",
          wsRef.current.readyState
        );
      }
    } else {
      console.error("WebSocket referansı bulunamadı.");
    }
  };

  return (
    <WebSocketContext.Provider value={{ sendMessage, salons }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
