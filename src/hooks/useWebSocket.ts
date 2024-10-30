import { useEffect, useRef } from "react";

// WebSocket hook'u
const useWebSocket = (
  telegram_id: number | undefined,
  onMessage: (data: any) => void
) => {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!telegram_id) return; // Eğer telegram_id yoksa bağlantı kurma

    const ws = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL); // .env'den WebSocket URL'sini alıyoruz
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket bağlantısı kuruldu");
      // İlk bağlantıda telegram_id'yi JSON formatında gönderiyoruz
      ws.send(JSON.stringify({ telegram_id }));
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
      console.log("WebSocket bağlantısı kapandı");
      wsRef.current = null;
    };

    ws.onerror = (error) => {
      console.error("WebSocket hata:", error);
    };

    // Bileşen unmount olduğunda WebSocket'i kapat
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [telegram_id, onMessage]);

  // Mesaj göndermek için bir fonksiyon döndürelim
  const sendMessage = (message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  };

  return { sendMessage }; // WebSocket ile mesaj göndermek için döndür
};

export default useWebSocket;
