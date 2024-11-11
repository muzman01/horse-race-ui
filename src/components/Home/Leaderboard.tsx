import { useState } from "react";
import { nullUserIcon } from "../../images";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState("hp");

  // Redux'tan leaderboard verisini çekiyoruz
  const { hp, game, loading, error } = useSelector(
    (state: RootState) => state.leaderboard
  );

  // Hata ve yüklenme durumları
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Aktif sekmeye göre veriyi belirleme
  const leaderboardData: any = activeTab === "hp" ? hp : game;

  return (
    <div className="flex flex-col items-center mt-8 w-full text-white p-4 rounded-lg max-w-sm">
      <h1 className="text-lg font-bold mb-4 text-[#DF9826]">Leaderboard</h1>

      {/* Sekmeler */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-1 rounded-lg text-xs font-medium ${
            activeTab === "hp"
              ? "bg-[#f5a623] text-white"
              : "bg-[#161b22] text-gray-400"
          }`}
          onClick={() => setActiveTab("hp")}
        >
          HP Point
        </button>
        <button
          className={`px-4 py-1 rounded-lg text-xs font-medium ${
            activeTab === "wins"
              ? "bg-[#f5a623] text-white"
              : "bg-[#161b22] text-gray-400"
          }`}
          onClick={() => setActiveTab("wins")}
        >
          Top Winner
        </button>
      </div>

      {/* Top 3 veya Veri Yok */}
      {leaderboardData.length > 3 ? (
        <>
          <div className="flex justify-center items-center space-x-8 mb-4 mt-4">
            {/* #2 */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center mb-1">
                <img
                  src={
                    leaderboardData[1]?.photo_url !== "Unknown"
                      ? leaderboardData[1]?.photo_url
                      : nullUserIcon
                  }
                  alt="User Avatar"
                  className="rounded-full"
                />
              </div>
              <p className="text-xs font-semibold">
                {leaderboardData[1]?.username}
              </p>
              <p className="text-[10px] text-gray-400">
                {activeTab === "hp"
                  ? leaderboardData[1]?.hp
                  : leaderboardData[1]?.wins}{" "}
                {activeTab === "hp" ? "HP" : "win"}
              </p>
              <div className="bg-[#C0C0C0] text-center mt-1 p-1 w-6 h-6 rounded-full text-[10px] font-bold text-white">
                #2
              </div>
            </div>

            {/* #1 (Ortada ve büyük) */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#f5a623] rounded-full flex items-center justify-center mb-1">
                <img
                  src={
                    leaderboardData[0]?.photo_url !== "Unknown"
                      ? leaderboardData[0]?.photo_url
                      : nullUserIcon
                  }
                  alt="User Avatar"
                  className="rounded-full"
                />
              </div>
              <p className="text-xs font-semibold">
                {leaderboardData[0]?.username}
              </p>
              <p className="text-[10px] text-gray-400">
                {activeTab === "hp"
                  ? leaderboardData[0]?.hp
                  : leaderboardData[0]?.wins}{" "}
                {activeTab === "hp" ? "HP" : "win"}
              </p>
              <div className="bg-[#FFD700] text-center mt-1 p-1 w-6 h-6 rounded-full text-[10px] font-bold text-white">
                #1
              </div>
            </div>

            {/* #3 */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center mb-1">
                <img
                  src={
                    leaderboardData[2]?.photo_url !== "Unknown"
                      ? leaderboardData[2]?.photo_url
                      : nullUserIcon
                  }
                  alt="User Avatar"
                  className="rounded-full"
                />
              </div>
              <p className="text-xs font-semibold">
                {leaderboardData[2]?.username}
              </p>
              <p className="text-[10px] text-gray-400">
                {activeTab === "hp"
                  ? leaderboardData[2]?.hp
                  : leaderboardData[2]?.wins}{" "}
                {activeTab === "hp" ? "HP" : "win"}
              </p>
              <div className="bg-[#CD7F32] text-center mt-1 p-1 w-6 h-6 rounded-full text-[10px] font-bold text-white">
                #3
              </div>
            </div>
          </div>

          {/* Diğer kullanıcılar */}
          <div className="space-y-3 w-full">
            {leaderboardData.slice(3, 4).map((user: any, index: any) => (
              <div
                key={index + 3}
                className="flex items-center justify-between px-4 py-2 bg-[#161b22] rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-500 rounded-full">
                    <img
                      src={
                        user?.photo_url !== "Unknown"
                          ? user?.photo_url
                          : nullUserIcon
                      }
                      alt="User Avatar"
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">{user.username}</p>
                    <p className="text-[10px] text-gray-400">
                      {activeTab === "hp" ? user.hp : user.wins}{" "}
                      {activeTab === "hp" ? "HP" : "win"}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold">#{index + 4}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-sm text-gray-400 mt-4">No data available yet!</p>
      )}
    </div>
  );
};

export default Leaderboard;
