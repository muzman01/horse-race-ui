import { useEffect, useRef, useCallback } from "react";

// WebSocket hook'u
const useSalonWebSocket = (onMessage: (data: any) => void) => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<any | null>(null); // Yeniden bağlanma için timeout referansı
  const reconnectAttemptsRef = useRef<number>(0); // Yeniden bağlanma denemesi sayacı
  const isManuallyClosed = useRef(false); // Kullanıcı tarafından kapatıldı mı
  const pingIntervalRef = useRef<any | null>(null); // Ping göndermek için interval referansı
  const isConnected = useRef(false); // Bağlantı durumu kontrolü

  const connectWebSocket = useCallback(() => {
    if (isConnected.current) {
      return;
    }

    const ws = new WebSocket("wss://winroller.muzmanlive.com/ws2");
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ action: "saloon" }));
      reconnectAttemptsRef.current = 0; // Bağlantı kurulduğunda deneme sayacını sıfırla
      isConnected.current = true; // Bağlantı kurulduğu bilgisini güncelle

      // Bağlantı açıkken her 30 saniyede bir ping gönder
      pingIntervalRef.current = setInterval(() => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ action: "ping" }));
        }
      }, 30000); // 30 saniye
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error("Mesaj parse edilemedi:", error);
      }
    };

    ws.onclose = () => {
      wsRef.current = null;
      isConnected.current = false; // Bağlantı kapandığında durumu güncelle

      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current); // Ping intervalini temizle
      }

      if (!isManuallyClosed.current) {
        reconnectAttemptsRef.current += 1;

        if (reconnectAttemptsRef.current < 5) {
          // Maksimum 5 kez yeniden bağlanmayı dene
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(
              `Yeniden bağlanmaya çalışılıyor... Deneme ${reconnectAttemptsRef.current}`
            );
            connectWebSocket();
          }, 5000); // 5 saniye sonra yeniden dene
        } else {
          console.error("Maksimum yeniden bağlanma denemesi aşıldı.");
        }
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket hata:", error);
    };
  }, [onMessage]);

  useEffect(() => {
    connectWebSocket();

    return () => {
      isManuallyClosed.current = true;
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
      isConnected.current = false; // Cleanup sonrası bağlantı durumu sıfırlansın
    };
  }, [connectWebSocket]);

  const sendMessage = (message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.error("WebSocket bağlantısı açık değil.");
    }
  };

  const joinTable = (
    telegram_id: number,
    salon_id: number,
    table_id: number
  ) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          action: "join_table",
          telegram_id,
          salon_id,
          table_id,
        })
      );
    } else {
      console.error("WebSocket bağlantısı açık değil.");
    }
  };

  const leaveTable = (
    telegram_id: number,
    salon_id: number,
    table_id: number
  ) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          action: "leave_table",
          telegram_id,
          salon_id,
          table_id,
        })
      );
    } else {
      console.error("WebSocket bağlantısı açık değil.");
    }
  };

  return { sendMessage, joinTable, leaveTable };
};

export default useSalonWebSocket;
