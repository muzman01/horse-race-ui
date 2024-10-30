import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useParams, useNavigate } from "react-router-dom"; // useNavigate eklendi
import { cardTable } from "../../images";
import DiceComponent from "../DiceComponent";
import YellowHorse from "../Horses/YellowHorse";
import WhiteHorse from "../Horses/WhiteHorse";
import BlackHorse from "../Horses/BlackHorse";
import RedHorse from "../Horses/RedHorse";
import Confetti from "react-confetti"; // Confetti paketi eklendi

const MAX_ROLLS = 5; // Maksimum zar sayısı

const GameRoomComponent: React.FC = () => {
  const { salon_id, table_id } = useParams<{
    salon_id: string;
    table_id: string;
  }>();
  const { salons } = useSelector((state: RootState) => state.salon);
  const telegram_id = useSelector(
    (state: RootState) => state?.user?.user?.telegram_id || 0
  ); // Kullanıcının Telegram ID'sini alıyoruz
  const horseAreaRef: any = useRef(null);
  const navigate = useNavigate(); // Yönlendirme için useNavigate kullanıyoruz

  const [countdown, setCountdown] = useState<number>(10); // Zar atma geri sayımı
  const [currentRoll, setCurrentRoll] = useState<number | null>(null); // Şu anki zar atışı (Başlangıç değeri null)
  const [previousRolls, setPreviousRolls] = useState<number[]>([]); // Sizin zarlarınız
  const [randomRolls, setRandomRolls] = useState<{ [key: number]: number[] }>(
    {}
  ); // Diğer oyuncuların zarları
  const [winner, setWinner] = useState<any | null>(null); // Kazanan oyuncu
  const [confettiVisible, setConfettiVisible] = useState<boolean>(false); // Confetti kontrolü
  const [ws, setWs] = useState<WebSocket | null>(null); // WebSocket bağlantısı
  const [isConnected, setIsConnected] = useState<boolean>(false); // WebSocket bağlantı durumu

  const salonIdNumber = Number(salon_id);
  const tableIdNumber = Number(table_id);

  const salon = salons.find((salon) => salon.salon_id === salonIdNumber);
  const table: any = salon?.tables.find(
    (table) => table.table_id === tableIdNumber
  );

  // WebSocket bağlantısı başlatma
  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:9003"); // WebSocket adresi
    setWs(ws);

    ws.onopen = () => {
      console.log("WebSocket bağlantısı açıldı.");
      setIsConnected(true); // WebSocket bağlantısı açıldığında bağlantı durumunu güncelle
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        if (message.action === "game_started") {
          console.log(`Game started with ID: ${message.game_id}`);
        } else if (message.action === "roll_acknowledged") {
          console.log(`Player ${message.player_id} rolled a ${message.roll}`);
        } else if (message.action === "winner_announced") {
          setWinner(message.winner_id);
          setConfettiVisible(true);
          setTimeout(() => setConfettiVisible(false), 5000);
        }
      } catch (e) {
        console.error("Mesaj JSON formatında değil:", event.data);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket bağlantısı kapandı.");
      setIsConnected(false); // WebSocket bağlantısı kapandığında bağlantı durumunu güncelle
    };

    return () => {
      ws.close();
    };
  }, []);

  // Oyun başlatıldığında backend'e mesaj gönderme
  const startGame = () => {
    if (ws && isConnected && table) {
      const message = {
        action: "start_game",
        players: table.players,
        salon_id: salon_id,
        table_id: table_id,
      };
      ws.send(JSON.stringify(message));
    } else {
      console.log("WebSocket henüz bağlanmadı.");
    }
  };

  useEffect(() => {
    if (isConnected) {
      startGame(); // WebSocket bağlantısı açıldığında oyun başlatma fonksiyonu çağrılır
    }
  }, [isConnected]);

  // Zar atma işlemi
  const handleRollDice = () => {
    if (previousRolls.length >= MAX_ROLLS || !isConnected) return; // Eğer 5 zar atılmışsa veya WebSocket bağlantısı yoksa zar atmayı durdur

    const roll = Math.floor(Math.random() * 6) + 1; // 1 ile 6 arasında zar atıyoruz
    setCurrentRoll(roll); // Mevcut zarı güncelle
    setPreviousRolls((prev) => [...prev, roll]); // Sizin zarları güncelle
    setCountdown(10); // Zar atıldıktan sonra geri sayımı resetle

    // Eğer WebSocket bağlıysa, kendi zarınızı gönderin
    if (ws) {
      const message = {
        action: "roll_dice",
        player_id: telegram_id,
        roll: roll,
        salon_id: salon_id,
        table_id: table_id,
      };
      ws.send(JSON.stringify(message));
    }

    // Diğer oyunculara rastgele zar değerleri ver ve her biri için ayrı mesaj gönder
    const newRandomRolls: { [key: number]: number[] } = { ...randomRolls };

    table.players.forEach((player: any) => {
      if (player.player_id !== telegram_id) {
        if (!newRandomRolls[player.player_id]) {
          newRandomRolls[player.player_id] = [];
        }
        if (newRandomRolls[player.player_id].length < MAX_ROLLS) {
          const playerRoll = Math.floor(Math.random() * 6) + 1; // Diğer oyuncular için zar at
          newRandomRolls[player.player_id].push(playerRoll); // Diğer oyuncuların zarını güncelle

          // WebSocket üzerinden her oyuncunun zarını ayrı bir mesaj olarak gönder
          if (ws) {
            const playerMessage = {
              action: "roll_dice",
              player_id: player.player_id,
              roll: playerRoll,
              salon_id: salon_id,
              table_id: table_id,
            };
            ws.send(JSON.stringify(playerMessage)); // Her oyuncu için ayrı mesaj gönder
          }
        }
      }
    });

    setRandomRolls(newRandomRolls); // Rastgele zar değerlerini güncelle
  };

  // Masayı boşaltma işlemi
  const leaveTable = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/salons/${salon_id}/tables/${table_id}/leave`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ telegram_id }),
        }
      );
      if (response.ok) {
        console.log("Masa boşaltıldı, salona yönlendiriliyor.");
        navigate("/salon"); // Salona yönlendir
      } else {
        console.error("Masa boşaltma başarısız oldu.");
      }
    } catch (error) {
      console.error("Masa boşaltılırken hata oluştu:", error);
    }
  };

  const onClose = () => {
    // winner state'ini null yaparak modalı kapat
    setWinner(null);
  };

  if (!table) {
    return <div>Tablo bulunamadı.</div>;
  }

  // At bileşenleri dizisi
  const horses = [YellowHorse, WhiteHorse, BlackHorse, RedHorse];

  return (
    <div className="flex flex-col items-center gap-4 min-h-screen p-4 bg-gray-900">
      {/* Confetti */}
      {confettiVisible && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}

      {/* Header Alanı */}
      <div className="w-full h-12 bg-[#5e1f1f] flex items-center justify-center rounded-md shadow-md">
        <h1 className="text-yellow-400 text-lg font-semibold">Game Room</h1>
      </div>

      {/* Atlar ve Sahipleri Alanı */}
      <div className="w-full p-4 bg-[#5e1f1f] border border-gray-700 rounded-lg">
        <div className="flex flex-col gap-3">
          {table.players.map((player: any, index: any) => {
            const HorseComponent = horses[index % horses.length]; // Her oyuncuya bir at veririz (sıralı şekilde döner)
            const isMyHorse = player.player_id === telegram_id; // Kendi atını bulmak için
            const diceValue = isMyHorse
              ? currentRoll || 0 // Eğer oyuncu sizseniz zar değeri `currentRoll` olacak
              : (randomRolls[player.player_id] || []).reduce(
                  (sum, roll) => sum + roll,
                  0
                ); // Diğer oyuncular için toplam zar

            return (
              <div
                key={index}
                className="flex items-start justify-between relative"
              >
                <div
                  className="relative w-full h-24 rounded-md shadow-md bg-cover bg-center"
                  ref={horseAreaRef} // Atın bulunduğu alanın genişliğini almak için referans
                  style={{
                    backgroundImage: `url(${cardTable})`,
                    backgroundPosition: "center",
                    backgroundSize: "150%",
                  }}
                >
                  <div className="flex -ml-10 items-start justify-center h-full">
                    <span className="text-yellow-400 font-semibold">
                      {horseAreaRef.current && (
                        <HorseComponent
                          diceValue={diceValue} // Her oyuncu için doğru zar değerini göster
                          parentWidth={horseAreaRef?.current?.offsetWidth} // Genişliği prop olarak geçiyoruz
                        />
                      )}
                    </span>
                  </div>
                  <span className="absolute bottom-2 left-2 text-white">
                    Owner: {player.player_id}
                    {isMyHorse && (
                      <span className="ml-2 text-yellow-400">
                        {" "}
                        - Your Horse!!
                      </span>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Oyun Alanı ve Zar Atma Bölgesi */}
      <div className="relative w-full mt-4 p-6 bg-[#5e1f1f] rounded-md border border-gray-700 shadow-md flex justify-center">
        <div
          className="w-full flex-col h-[400px] bg-cover bg-center rounded-md flex justify-center items-center relative"
          style={{
            backgroundImage: `url(${cardTable})`,
            backgroundPosition: "center",
            backgroundSize: "150%",
          }}
        >
          {/* Geri Sayım ve Zar Atma Alanı */}
          <div className="flex w-full h-full flex-col items-center justify-center bg-black bg-opacity-50">
            {/* Geri Sayım */}
            <div className="text-yellow-400 text-2xl mb-4">
              Zar atmak için: {countdown} saniye
            </div>

            {/* Zar Atma Butonu */}
            <DiceComponent
              diceResult={currentRoll || 0}
              rollDice={handleRollDice}
            />

            {/* Şu anki zar */}
            <div className="mt-4 text-white text-lg">
              Şu anki zar:{" "}
              {currentRoll !== null ? currentRoll : "Henüz zar atılmadı"}
            </div>

            {/* Önceki zar sonuçları */}
            <div className="mt-4 text-yellow-400">
              Önceki zarlar:{" "}
              {previousRolls.length > 0
                ? previousRolls.join(", ")
                : "Henüz zar atılmadı"}
            </div>
          </div>

          {/* Kazananı Göster */}
          {winner && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-8 rounded-lg shadow-lg text-center relative">
                <button
                  onClick={onClose}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  &#x2715; {/* Bu kapatma butonunun simgesi */}
                </button>
                <div className="text-green-500 text-2xl mt-4">
                  Kazanan: {winner === telegram_id ? "Sen!" : `Jokey ${winner}`}
                </div>
              </div>
            </div>
          )}

          {/* Diğer Oyuncuların Durumu - Arka Planda */}
          <div className="w-full p-4 bg-gray-700 bg-opacity-50 shadow-md">
            <h3 className="text-white text-lg mb-2">Other Jokeys</h3>
            <ul className="text-yellow-400 text-sm">
              {table.players.map((player: any, index: any) => (
                <li key={index}>
                  Jokey {player.player_id}: Zarlardan Toplam ={" "}
                  {(randomRolls[player.player_id] || []).reduce(
                    (sum, roll) => sum + roll,
                    0
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameRoomComponent;
