import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useParams, useNavigate } from "react-router-dom";
import { cardTable } from "../../images";
import DiceComponent from "../DiceComponent";
import YellowHorse from "../Horses/YellowHorse";
import WhiteHorse from "../Horses/WhiteHorse";
import BlackHorse from "../Horses/BlackHorse";
import RedHorse from "../Horses/RedHorse";
import Confetti from "react-confetti";
import LoadingComponent from "../LoadingComponent";

const MAX_ROLLS = 5;

const GameComponentBots: React.FC = () => {
  const { salon_id, table_id } = useParams<{
    salon_id: string;
    table_id: string;
  }>();
  const { salons } = useSelector((state: RootState) => state.salon);
  const telegram_id = useSelector(
    (state: RootState) => state?.user?.user?.telegram_id || 0
  );
  const horseAreaRef: any = useRef(null);
  const navigate = useNavigate();

  const [countdown, setCountdown] = useState<number>(10);
  const [currentRoll, setCurrentRoll] = useState<number | null>(null);
  const [previousRolls, setPreviousRolls] = useState<number[]>([]);
  const [randomRolls, setRandomRolls] = useState<{ [key: number]: number[] }>(
    {}
  );
  console.log(randomRolls);

  const [totalRolls, setTotalRolls] = useState<{ [key: number]: number }>({});
  const [winner, setWinner] = useState<any | null>(null);
  const [confettiVisible, setConfettiVisible] = useState<boolean>(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [diceRollsLeft, setDiceRollsLeft] = useState<number>(MAX_ROLLS);

  const salonIdNumber = Number(salon_id);
  const tableIdNumber = Number(table_id);

  const salon = salons.find((salon) => salon.salon_id === salonIdNumber);
  const table: any = salon?.tables.find(
    (table) => table.table_id === tableIdNumber
  );

  useEffect(() => {
    const ws = new WebSocket("wss://winroller.muzmanlive.com/ws4");
    setWs(ws);

    ws.onopen = () => {
      console.log("WebSocket bağlantısı açıldı.");
      setIsConnected(true);

      // WebSocket bağlantısı açıldığında startGame çağrılıyor.
      if (ws && table) {
        const message = {
          action: "start_game",
          player_id: telegram_id.toString(),
          salon_id: salon_id,
          table_id: table_id,
        };
        ws.send(JSON.stringify(message));
        console.log("start_game mesajı gönderildi:", message);
      }
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        if (message.action === "game_started") {
          console.log(`Game started with ID: ${message.game_id}`);
        } else if (message.action === "roll_result") {
          const updatedRolls = message.players.reduce(
            (acc: { [key: number]: number[] }, player: any) => {
              acc[player.player_id] = player.rolls;
              return acc;
            },
            {}
          );

          const totalRollsUpdate = message.players.reduce(
            (acc: { [key: number]: number }, player: any) => {
              acc[player.player_id] = player.total_roll;
              return acc;
            },
            {}
          );

          setRandomRolls(updatedRolls);
          setTotalRolls(totalRollsUpdate);
        } else if (message.action === "winner_announced") {
          setWinner(message.winner_id);
          setConfettiVisible(true);
          setTimeout(() => setConfettiVisible(false), 3000);
        }
      } catch (e) {
        console.error("Mesaj JSON formatında değil:", event.data);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket bağlantısı kapandı.");
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  // const startGame = () => {
  //   if (ws && isConnected && table) {
  //     const message = {
  //       action: "start_game",
  //       player_id: telegram_id,
  //       salon_id: salon_id,
  //       table_id: table_id,
  //     };
  //     ws.send(JSON.stringify(message));
  //   }
  // };

  useEffect(() => {
    if (diceRollsLeft > 0 && countdown > 0) {
      const interval = setInterval(() => setCountdown(countdown - 1), 1000);
      return () => clearInterval(interval);
    } else if (countdown === 0 && diceRollsLeft > 0) {
      handleRollDice();
      setCountdown(10);
    }
  }, [countdown, diceRollsLeft]);

  const handleRollDice = () => {
    if (diceRollsLeft <= 0 || !isConnected) return;

    const userRoll = Math.floor(Math.random() * 6) + 1;
    setCurrentRoll(userRoll);
    setPreviousRolls((prev) => [...prev, userRoll]);

    const botRolls: { [key: number]: number } = {};
    table.players.forEach((player: any) => {
      if (player.player_id !== telegram_id) {
        botRolls[player.player_id] = Math.floor(Math.random() * 6) + 1;
      }
    });

    setRandomRolls((prevRolls) => ({
      ...prevRolls,
      [telegram_id]: [...(prevRolls[telegram_id] || []), userRoll],
      ...Object.fromEntries(
        Object.entries(botRolls).map(([botId, roll]: any) => [
          botId,
          [...(prevRolls[botId] || []), roll],
        ])
      ),
    }));

    setTotalRolls((prevTotalRolls) => ({
      ...prevTotalRolls,
      [telegram_id]: (prevTotalRolls[telegram_id] || 0) + userRoll,
      ...Object.fromEntries(
        Object.entries(botRolls).map(([botId, roll]: any) => [
          botId,
          (prevTotalRolls[botId] || 0) + roll,
        ])
      ),
    }));

    setCountdown(10);
    setDiceRollsLeft(diceRollsLeft - 1);

    if (ws) {
      const message = {
        action: "roll_dice",
        player_id: telegram_id.toString(),
        roll: userRoll,
        salon_id: salon_id,
        table_id: table_id,
        bot_rolls: botRolls,
      };
      ws.send(JSON.stringify(message));
    }
  };

  const onClose = () => {
    setWinner(null);
    navigate(`/saloon`);
  };

  if (!table) {
    return <LoadingComponent />;
  }

  const horses = [YellowHorse, WhiteHorse, BlackHorse, RedHorse];

  return (
    <div className="flex flex-col items-center gap-4 min-h-screen p-4 bg-gray-900">
      {confettiVisible && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}

      <div className="w-full h-12 bg-[#5e1f1f] flex items-center justify-center rounded-md shadow-md">
        <h1 className="text-yellow-400 text-lg font-semibold">Game Room</h1>
      </div>

      <div className="w-full p-4 bg-[#5e1f1f] border border-gray-700 rounded-lg">
        <div className="flex flex-col gap-3">
          {table.players.map((player: any, index: any) => {
            const HorseComponent = horses[index % horses.length];
            const isMyHorse = player.player_id === telegram_id;
            const diceValue = totalRolls[player.player_id] || 0;

            return (
              <div
                key={index}
                className="flex items-start justify-between relative"
              >
                <div
                  className="relative w-full h-24 rounded-md shadow-md bg-cover bg-center"
                  ref={horseAreaRef}
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
                          diceValue={diceValue}
                          parentWidth={horseAreaRef?.current?.offsetWidth}
                        />
                      )}
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-2 w-full flex justify-between items-center px-4">
                    <span className="text-white">
                      {isMyHorse ? (
                        <span className="ml-2 text-yellow-400">
                          Your Horse!!
                        </span>
                      ) : (
                        <>Owner: {player.player_id}</>
                      )}
                    </span>
                    <span className="text-white">Total Dice: {diceValue}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative w-full mt-4 p-6 bg-[#5e1f1f] rounded-md border border-gray-700 shadow-md flex justify-center">
        <div
          className="w-full flex-col h-[300px] bg-cover bg-center rounded-md flex justify-center items-center relative"
          style={{
            backgroundImage: `url(${cardTable})`,
            backgroundPosition: "center",
            backgroundSize: "150%",
          }}
        >
          <div className="flex w-full h-full flex-col items-center justify-center bg-black bg-opacity-50">
            <div className="text-yellow-400 text-2xl mb-4">
              {diceRollsLeft > 0
                ? `To roll the dice: ${countdown} seconds`
                : "Your dice are over!"}
            </div>

            <DiceComponent
              diceResult={currentRoll || 0}
              rollDice={handleRollDice}
            />

            <div className="mt-4 text-white text-lg">
              Current dice:{" "}
              {currentRoll !== null
                ? currentRoll
                : "The dice are not cast yet."}
            </div>

            <div className="mt-4 text-yellow-400">
              Previous dice:{" "}
              {previousRolls.length > 0
                ? previousRolls.join(", ")
                : "The dice are not cast yet."}
            </div>
          </div>
          {winner && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 animate-fadeIn">
              <div className="bg-gradient-to-b from-yellow-400 to-[#c25918] p-10 rounded-md shadow-2xl text-center relative transform ">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 text-white text-2xl hover:text-yellow-300"
                >
                  &#x2715;
                </button>

                {/* Confetti Animation */}
                <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/path/to/confetti.png')] bg-cover opacity-20 animate-confetti" />
                </div>

                {/* Winner Text */}
                <div className="text-white font-extrabold text-4xl mb-4">
                  🎉 Winner! 🎉
                </div>
                <div className="text-white text-xl font-medium mt-2">
                  {Number(winner) === telegram_id ? "You!" : `Jokey ${winner}`}
                </div>

                {/* Winner Icon */}
                <div className="text-6xl mt-4">
                  {Number(winner) === telegram_id ? "🏆" : "🎊"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameComponentBots;