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

const MAX_ROLLS = 5;

const GameRoomComponent: React.FC = () => {
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
    const ws = new WebSocket("ws://127.0.0.1:9003");
    setWs(ws);

    ws.onopen = () => {
      console.log("WebSocket bağlantısı açıldı.");
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        if (message.action === "game_started") {
          console.log(`Game started with ID: ${message.game_id}`);
        } else if (message.action === "roll_acknowledged") {
          const { player_id, roll } = message;
          setRandomRolls((prevRolls) => ({
            ...prevRolls,
            [player_id]: [...(prevRolls[player_id] || []), roll],
          }));
        } else if (message.action === "winner_announced") {
          setWinner(message.winner_id);
          setConfettiVisible(true);
          setTimeout(() => setConfettiVisible(false), 10);
        } else if (message.action === "roll_update") {
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

  useEffect(() => {
    if (diceRollsLeft > 0 && countdown > 0) {
      const interval = setInterval(() => setCountdown(countdown - 1), 1000);
      return () => clearInterval(interval);
    } else if (countdown === 0 && diceRollsLeft > 0) {
      handleRollDice();
      setCountdown(10);
    }
  }, [countdown, diceRollsLeft]);

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
      startGame();
    }
  }, [isConnected]);

  const handleRollDice = () => {
    if (diceRollsLeft <= 0 || !isConnected) return;

    const roll = Math.floor(Math.random() * 6) + 1;
    setCurrentRoll(roll);
    setPreviousRolls((prev) => [...prev, roll]);
    setCountdown(10);
    setDiceRollsLeft(diceRollsLeft - 1); // Zar hakkını azalt

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
  };

  const onClose = () => {
    setWinner(null);
    navigate(`/saloon`);
  };

  if (!table) {
    return <div>Loading</div>;
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

            const diceValue = isMyHorse
              ? previousRolls.reduce((sum, roll) => sum + roll, 0)
              : totalRolls[player.player_id] || 0;

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
                          {" "}
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
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-8 rounded-lg shadow-lg text-center relative">
                <button
                  onClick={onClose}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  &#x2715;
                </button>
                <div className="text-green-500 text-2xl mt-4">
                  Winner: {winner === telegram_id ? "You!" : `Jokey ${winner}`}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameRoomComponent;
