import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import TaskInfoModal from "../ModalSection/TaskInfoModal";
import Fligran from "../ComingSoon/Fligran";
import { FaCheckCircle, FaClock, FaSpinner } from "react-icons/fa"; // İkonları içe aktar
import { useTelegram } from "../../context/TelegramContext";

const TaskComponent = () => {
  const telegram_id = useSelector(
    (state: RootState) => state?.user?.user?.telegram_id || 0
  );
  const [copySuccess, setCopySuccess] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(); // Kullanıcı bilgilerini tutacak durum
  const { handleVibrate } = useTelegram();
  const referralLink = `https://t.me/WinRollerBot/winroller?startapp=${telegram_id}`;
  const handleCopy = () => {
    handleVibrate(); // Vibrasyonu çal
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // 2 saniye sonra "Kopyalandı" mesajını gizler
    });
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(
          `https://winroller.muzmanlive.com/users/${telegram_id}`
        );
        if (!response.ok) {
          console.log("Kullanıcı bulunamadı");
        }
        const data = await response.json();
        setUserInfo(data.result); // Kullanıcı bilgisini güncelle
      } catch (error) {
        console.error("Kullanıcı bilgileri alınırken hata oluştu:", error);
      }
    };

    fetchUserInfo();
  }, [telegram_id]); // telegram_id değiştiğinde yeniden yükle

  return (
    <div className="text-white p-6 w-full max-w-lg mx-auto flex flex-col items-center gap-4">
      <h1 className="text-3xl font-bold text-[#c25918]">Invite Friends</h1>

      <p className="text-sm text-gray-400">
        You and your friend will receive bonuses
      </p>

      <div className="bg-[#1e1e1e] p-4 rounded-2xl w-full">
        <p className="text-lg font-semibold text-white">Your Invite Link</p>
        <div className="relative mt-2">
          <input
            className="w-full bg-[#2b2f36] rounded-2xl border-none py-3 pl-3 pr-10 text-gray-300 focus:outline-none cursor-pointer"
            id="referralLink"
            type="url"
            readOnly
            value={referralLink}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            <button onClick={handleCopy} className="p-1">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 512 512"
                className="w-5 h-5 text-gray-400 hover:text-gray-300"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M408 480H184a72 72 0 0 1-72-72V184a72 72 0 0 1 72-72h224a72 72 0 0 1 72 72v224a72 72 0 0 1-72 72z" />
                <path d="M160 80h235.88A72.12 72.12 0 0 0 328 32H104a72 72 0 0 0-72 72v224a72.12 72.12 0 0 0 48 67.88V160a80 80 0 0 1 80-80z" />
              </svg>
            </button>
          </div>
          {copySuccess && (
            <p className="text-sm text-green-500 mt-2">
              Link copied to clipboard!
            </p>
          )}
        </div>
        {/* <div className="mt-4 flex gap-2">
          <button className="flex-1 bg-gray-300 text-black rounded-2xl py-3 flex items-center justify-center gap-2 active:scale-95 transition-all">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 256 256"
              className="w-5 h-5"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M128,76a44,44,0,1,1-44,44A44,44,0,0,1,128,76Zm48-12h16V80a8,8,0,0,0,16,0V64h16a8,8,0,0,0,0-16H208V32a8,8,0,0,0-16,0V48H176a8,8,0,0,0,0,16Zm45.35,40.11a8,8,0,0,0-6.57,9.21A88.85,88.85,0,0,1,216,128a87.62,87.62,0,0,1-22.24,58.41A79.86,79.86,0,0,0,172,165.1a4,4,0,0,0-4.84.32,59.81,59.81,0,0,1-78.27,0A4,4,0,0,0,84,165.1a79.71,79.71,0,0,0-21.79,21.31A88,88,0,0,1,128,40a88.76,88.76,0,0,1,14.68,1.22,8,8,0,0,0,2.64-15.78,103.92,103.92,0,1,0,85.24,85.24A8,8,0,0,0,221.35,104.11Z" />
            </svg>
            Friend List
          </button>
          <button
            onClick={handleCopy}
            className="bg-gray-300 text-black rounded-2xl py-3 px-4 flex items-center justify-center active:scale-95 transition-all"
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              className="w-5 h-5"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M408 480H184a72 72 0 0 1-72-72V184a72 72 0 0 1 72-72h224a72 72 0 0 1 72 72v224a72 72 0 0 1-72 72z" />
              <path d="M160 80h235.88A72.12 72.12 0,0,0,328,32H104a72 72 0,0,0-72,72v224a72.12,72.12,0,0,0,48,67.88V160a80,80,0,0,1-80-80z" />
            </svg>
          </button>
        </div> */}
      </div>
      <div className="bg-[#1e1e1e] p-4 rounded-2xl w-full mt-4">
        <p className="text-lg font-semibold text-white">Referral Rewards</p>
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex justify-between items-center bg-[#2b2f36] p-3 rounded-lg">
            <div className="text-sm flex gap-2">
              <p className="text-gray-400">Level 1</p>
              <p className="text-l font-bold text-[#c25918]"></p>
              <p className="text-xs text-gray-400">
                {" "}
                <span className="text-l font-bold text-[#c25918]">1</span> Game
                Pass
              </p>
              <p className="text-gray-400">Reward</p>
            </div>
            <div>
              {userInfo?.references?.level1?.is_finished ? (
                <span className="text-xs font-bold text-[#4CAF50] flex items-center">
                  <FaCheckCircle className="mr-1" />{" "}
                </span>
              ) : userInfo?.references?.level1?.is_started ? (
                <span className="text-xs font-bold text-[#c25918] flex items-center">
                  <FaSpinner className="mr-1 animate-spin" />{" "}
                </span>
              ) : (
                <span className="text-xs font-bold text-[#FFC107] flex items-center">
                  <FaClock className="mr-1" /> {/* Bekliyor için sarı saat */}
                </span>
              )}
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-[#c25918]">
                {" "}
                {userInfo?.references?.level1?.current_reference || 0} / 5
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex justify-between items-center bg-[#2b2f36] p-3 rounded-lg">
            <div className="text-sm flex gap-2">
              <p className="text-gray-400">Level 2</p>
              <p className="text-l font-bold text-[#c25918]"></p>
              <p className="text-xs text-gray-400">
                {" "}
                <span className="text-l font-bold text-[#c25918]">5</span> Ton
              </p>
              <p className="text-gray-400">Reward</p>
            </div>
            <div>
              {userInfo?.references?.level2?.is_finished ? (
                <span className="text-xs font-bold text-[#4CAF50] flex items-center">
                  <FaCheckCircle className="mr-1" />{" "}
                </span>
              ) : userInfo?.references?.level2?.is_started ? (
                <span className="text-xs font-bold text-[#c25918] flex items-center">
                  <FaSpinner className="mr-1 animate-spin" />{" "}
                </span>
              ) : (
                <span className="text-xs font-bold text-[#FFC107] flex items-center">
                  <FaClock className="mr-1" /> {/* Bekliyor için sarı saat */}
                </span>
              )}
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-[#c25918]">
                {" "}
                {userInfo?.references?.level2?.current_reference || 0} / 100
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex justify-between items-center bg-[#2b2f36] p-3 rounded-lg">
            <div className="text-sm flex gap-2">
              <p className="text-gray-400">Level 3</p>
              <p className="text-l font-bold text-[#c25918]"></p>
              <p className="text-xs text-gray-400">
                {" "}
                <span className="text-l font-bold text-[#c25918]">15</span> TON
              </p>
              <p className="text-gray-400">Reward</p>
            </div>
            <div>
              {userInfo?.references?.level3?.is_finished ? (
                <span className="text-xs font-bold text-[#4CAF50] flex items-center">
                  <FaCheckCircle className="mr-1" />{" "}
                </span>
              ) : userInfo?.references?.level3?.is_started ? (
                <span className="text-xs font-bold text-[#c25918] flex items-center">
                  <FaSpinner className="mr-1 animate-spin" />{" "}
                </span>
              ) : (
                <span className="text-xs font-bold text-[#FFC107] flex items-center">
                  <FaClock className="mr-1" /> {/* Bekliyor için sarı saat */}
                </span>
              )}
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-[#c25918]">
                {" "}
                {userInfo?.references?.level3?.current_reference || 0} / 500
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-2 relative">
          <div className="flex justify-between items-center bg-[#2b2f36] p-3 rounded-lg relative">
            <div className="text-sm flex gap-2">
              <p className="text-gray-400">Level 4 </p>
              <p className="text-l font-bold text-[#c25918]"></p>
              <p className="text-xs text-gray-400">
                {" "}
                <span className="text-l font-bold text-[#c25918]">100</span> TON
              </p>
              <p className="text-gray-400">Reward</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-[#c25918]">0 / 1000</p>
            </div>

            {/* Overlay için coming soon */}
            <Fligran />
          </div>
        </div>
      </div>

      <TaskInfoModal />
    </div>
  );
};

export default TaskComponent;
