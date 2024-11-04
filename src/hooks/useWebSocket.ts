// hooks/useWebSocket.ts
import { useEffect, useRef } from "react";

const useWebSocket = (
  telegram_id: number | undefined,
  onMessage: (data: any) => void
) => {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Eğer telegram_id yoksa bağlantıyı başlatma
    if (!telegram_id) return;

    const createWebSocket = () => {
      const ws = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket bağlantısı kuruldu");
        ws.send(JSON.stringify({ telegram_id })); // İlk bağlantıda telegram_id'yi gönder
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data); // Gelen veriyi parse et
          console.log("WebSocket'ten gelen veri:", data);
          onMessage(data); // Gelen veriyi callback ile işliyoruz
        } catch (error) {
          console.error("Mesaj parse edilemedi:", error);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket bağlantısı kapandı, yeniden bağlanıyor...");
        setTimeout(createWebSocket, 1000); // Bağlantı kapandığında yeniden başlat
      };

      ws.onerror = (error) => {
        console.error("WebSocket hata:", error);
      };
    };

    // WebSocket bağlantısını başlat
    createWebSocket();

    // Bileşen unmount olduğunda WebSocket'i kapat
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [telegram_id, onMessage]);

  const sendMessage = (message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  };

  return { sendMessage };
};

export default useWebSocket;
