import { useState, useEffect } from "react";
import { Modal } from "@telegram-apps/telegram-ui";
import { ModalHeader } from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";
import { useTranslation } from "react-i18next";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { crwonIcon, birinciKral, ucuncuKral } from "../../images";
import useToast from "../../hooks/useToast";
import { useTelegram } from "../../context/TelegramContext";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface User {
  telegram_id: number;
  first_name: string;
  last_name: string;
  username: string;
  reputation_points: number;
  items: Array<{ reputation_points: number }> | null;
  total_reputation_points?: number;
}

const ITEMS_PER_PAGE = 5;

const LeaderBoard = () => {
  const { t } = useTranslation();
  const { warning } = useToast();
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleVibrate } = useTelegram();

  const [currentPage, setCurrentPage] = useState(1); // Sayfa durumu
  const totalPages = Math.ceil(leaderboard.length / ITEMS_PER_PAGE);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await axios.get(
          "https://winroller.muzmanlive.com/users"
        );
        if (response.data.message === "200: Success") {
          const users: any = response.data.result.map((user: User) => {
            const itemPoints = user.items
              ? user.items.reduce(
                  (acc, item) => acc + item.reputation_points,
                  0
                )
              : 0;
            return {
              ...user,
              total_reputation_points: user.reputation_points + itemPoints,
            };
          });

          const sortedUsers = users.sort(
            (a: User, b: User) =>
              // @ts-ignore
              b.total_reputation_points - a.total_reputation_points
          );
          setLeaderboard(sortedUsers);
        } else {
          warning("Data could not be fetched.");
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard data:", error);
        warning("Error loading leaderboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [warning]);

  const currentData = leaderboard.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToNextPage = () => {
    handleVibrate();
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const goToPreviousPage = () => {
    handleVibrate();
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <div>
      <Modal
        header={<ModalHeader>Reputation Board</ModalHeader>}
        trigger={
          <div
            onClick={handleVibrate}
            className="bg-[#2b2f36] p-4 rounded-lg flex items-center justify-between"
          >
            <p className="text-gray-300">Reputation Board</p>
            <div className="flex items-center space-x-2">
              <img src={crwonIcon} className="w-8 h-8" alt="crown" />
            </div>
          </div>
        }
        className="z-50"
      >
        <div className="p-6 bg-[#1e1e1e] rounded-2xl min-h-[350px] flex flex-col items-center shadow-xl space-y-6">
          {loading ? (
            <ClipLoader color="#ffffff" loading={loading} size={50} />
          ) : (
            <div className="w-full">
              <h2 className="text-2xl font-bold text-white text-center mb-4">
                {t("leaderboard.title", "Leaderboard")}
              </h2>
              <div className="space-y-3 w-full">
                {currentData.map((user, index) => {
                  let icon;
                  if (index === 0 && currentPage === 1) icon = birinciKral;
                  else if (index === 1 && currentPage === 1) icon = crwonIcon;
                  else if (index === 2 && currentPage === 1) icon = ucuncuKral;

                  return (
                    <div
                      key={user.telegram_id}
                      className="flex items-center justify-between p-3 rounded-lg bg-[#33373f]"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg font-bold text-white">
                          {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                        </span>
                        {icon ? (
                          <img
                            src={icon}
                            alt="crown icon"
                            className="w-6 h-6"
                          />
                        ) : (
                          <div className="w-10 h-10 flex items-center justify-center text-gray-500">
                            {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                          </div>
                        )}
                        <span className="text-gray-300 font-medium">
                          {user.username}
                        </span>
                      </div>
                      <span className="text-yellow-400 font-semibold">
                        {user.total_reputation_points} RP
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-center mt-6 items-center space-x-6">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="p-2 bg-[#2b2f36] text-gray-300 rounded-full disabled:opacity-50"
                >
                  <FaChevronLeft size={15} />
                </button>

                <span className="text-gray-300  font-semibold text-sm bg-[#2b2f36] rounded-full px-4 py-2">
                  {currentPage} / {totalPages}
                </span>

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="p-2 bg-[#2b2f36] text-gray-300  rounded-full disabled:opacity-50"
                >
                  <FaChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default LeaderBoard;
