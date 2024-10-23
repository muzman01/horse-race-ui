import { FiRefreshCcw } from "react-icons/fi"; // Güncelleme ikonu
import { FaMedal, FaTrophy, FaGem, FaCoins, FaShieldAlt } from "react-icons/fa"; // Doğru ikonlar
import { kurpiyerIcon } from "../../images";

const salons = [
  {
    name: "Bronz",
    entryFee: 1000,
    icon: <FaMedal className="text-orange-400 text-3xl" />, // Bronz için madalya
    rooms: [
      { players: ["Ali", "Ayşe", "Aslı", ""], bet: 102416 },
      { players: ["Mehmet", "", "", ""], bet: 50000 },
    ],
  },
  {
    name: "Demir",
    entryFee: 5000,
    icon: <FaShieldAlt className="text-gray-400 text-3xl" />, // Demir için kalkan
    rooms: [
      { players: ["Can", "Fatma", "", ""], bet: 30000 },
      { players: ["Zeynep", "Hasan", "", ""], bet: 75000 },
    ],
  },
  {
    name: "Silver",
    entryFee: 10000,
    icon: <FaTrophy className="text-gray-300 text-3xl" />, // Silver için kupa
    rooms: [
      { players: ["Murat", "Selin", "", ""], bet: 150000 },
      { players: ["Aslı", "Can", "", ""], bet: 85000 },
    ],
  },
  {
    name: "Altın",
    entryFee: 50000,
    icon: <FaCoins className="text-yellow-400 text-3xl" />, // Altın için para ikonu
    rooms: [
      { players: ["Efe", "Berk", "", ""], bet: 200000 },
      { players: ["Mehmet", "", "", ""], bet: 100000 },
    ],
  },
  {
    name: "Elmas",
    entryFee: 100000,
    icon: <FaGem className="text-blue-400 text-3xl" />, // Elmas için elmas ikonu
    rooms: [
      { players: ["Ali", "Zeynep", "", ""], bet: 300000 },
      { players: ["Ayşe", "", "", ""], bet: 500000 },
    ],
  },
];

const TournamentRooms = () => {
  return (
    <div className="p-4 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-white mb-2">
          🏆 Turnuva Salonları 🏆
        </h1>
        <p className="text-gray-300 text-lg font-light italic">
          Favori salonunu seç ve büyük kazanç için masalara otur! 💰
        </p>
      </div>

      {/* Her salon alt alta sıralanır */}
      {salons.map((salon, salonIndex) => (
        <div
          key={salonIndex}
          className="bg-[#212121] rounded-lg p-6 mb-6 shadow-lg relative"
        >
          {/* Salon başlıkları ve ikon */}
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-2">
              {salon.icon} {/* Salon ikonu */}
              <h2 className="text-white text-2xl font-bold">{salon.name}</h2>
            </div>

            {/* Güncelleme ikonu ve son güncelleme */}
            <div className="flex items-center space-x-2 text-gray-400">
              <FiRefreshCcw className="text-green-500" />{" "}
              {/* Güncelleme ikonu */}
              <span className="text-sm">Son güncelleme: 5sn önce</span>
            </div>
          </div>

          {/* Giriş ücreti */}
          <p className="text-gray-400 mb-4">
            Giriş Ücreti: {salon.entryFee} TL
          </p>

          {/* Masalar Yan Yana, Sağa Sola Kaydırmalı */}
          <div className="flex overflow-x-auto gap-4 p-2">
            {salon.rooms.map((room, roomIndex) => (
              <div
                key={roomIndex}
                className="bg-[#5e1f1f] p-6 rounded-lg w-90 flex flex-col items-center shadow-lg relative"
                style={{
                  background: "linear-gradient(145deg, #922f2f, #481111)",
                  boxShadow:
                    "8px 8px 20px rgba(0, 0, 0, 0.6), -8px -8px 20px rgba(255, 255, 255, 0.05)",
                }}
              >
                {/* Kurpiyer İkonu */}
                <img
                  src={kurpiyerIcon}
                  alt="Kurpiyer"
                  className="absolute top-0 left-0 w-12 h-12"
                />

                {/* Masa Başlığı */}
                <div className="text-center text-lg text-white mb-4 font-bold">
                  Masa {roomIndex + 1}
                </div>

                {/* Oyuncular */}
                <div className="flex justify-around w-full mb-4 space-x-4">
                  {room.players.map((player, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center justify-center space-y-2"
                    >
                      {player ? (
                        <>
                          <div className="w-14 h-14 rounded-full bg-gray-500"></div>
                          <span className="text-white text-sm">{player}</span>
                        </>
                      ) : (
                        <button className="bg-[#4d004d] text-white rounded-md px-6 py-2 text-sm whitespace-nowrap">
                          Otur
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Bahis Miktarı */}
                <div
                  className="px-4 py-2 rounded-md font-bold text-white text-lg"
                  style={{
                    background: "linear-gradient(90deg, #ffc107, #ff9800)",
                    boxShadow:
                      "0px 4px 10px rgba(255, 193, 7, 0.6), inset 0px 0px 10px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  Bahis: {room.bet} TL
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TournamentRooms;
