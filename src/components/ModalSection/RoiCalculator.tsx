import { Modal } from "@telegram-apps/telegram-ui";
import { ModalHeader } from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";
import { useTelegram } from "../../context/TelegramContext";
import { useState } from "react";

const RoiCalculator = () => {
  const { handleVibrate } = useTelegram();
  const [amount, setAmount] = useState<string>(""); // Kullanıcıdan alınan stake miktarı
  const [apr, setApr] = useState<string>("120"); // Varsayılan APR değeri (%120)

  // ROI Hesaplama Fonksiyonu
  const calculateROI = (amount: number, apr: number) => {
    const dailyRoi = (amount * (apr / 100)) / 365;
    const monthlyRoi = dailyRoi * 30;
    const yearlyRoi = dailyRoi * 365;
    return { dailyRoi, monthlyRoi, yearlyRoi };
  };

  // Hesaplama Sonuçları
  const { dailyRoi, monthlyRoi, yearlyRoi } = calculateROI(
    parseFloat(amount) || 0,
    parseFloat(apr) || 0
  );

  return (
    <div>
      <Modal
        header={<ModalHeader>ROI Calculator</ModalHeader>}
        trigger={
          <div onClick={handleVibrate} className="cursor-pointer">
            <i className="fas fa-calculator text-gray-400"></i>
          </div>
        }
        className="z-50"
      >
        <div className="p-6 bg-[#1e1e1e] rounded-2xl min-h-[350px] flex flex-col items-center shadow-xl space-y-6 text-white">
          {/* Kullanıcı Girişleri */}
          <div className="flex flex-col w-full space-y-4">
            {/* Stake Amount Input */}
            <div className="flex flex-col">
              <label htmlFor="amount" className="text-sm text-gray-400 mb-1">
                Stake Amount
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="bg-[#2b2f36] text-white p-3 rounded-lg focus:outline-none placeholder-gray-500"
              />
            </div>

            {/* APR Input */}
            <div className="flex flex-col">
              <label htmlFor="apr" className="text-sm text-gray-400 mb-1">
                APR (%)
              </label>
              <input
                type="number"
                id="apr"
                value={apr}
                onChange={(e) => setApr(e.target.value)}
                placeholder="Enter APR"
                className="bg-[#2b2f36] text-white p-3 rounded-lg focus:outline-none placeholder-gray-500"
              />
            </div>
          </div>

          {/* Hesaplama Sonuçları */}
          <div className="w-full space-y-4">
            <div className="flex justify-between">
              <p className="text-sm text-gray-400">Daily Earnings:</p>
              <p className="text-lg text-[#c25918] font-bold">
                {dailyRoi.toFixed(2)} $HP
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-400">Monthly Earnings:</p>
              <p className="text-lg text-[#c25918] font-bold">
                {monthlyRoi.toFixed(2)} $HP
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-400">Yearly Earnings:</p>
              <p className="text-lg text-[#c25918] font-bold">
                {yearlyRoi.toFixed(2)} $HP
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RoiCalculator;
