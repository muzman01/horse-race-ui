import { useState } from "react";
import { Rocket } from "react-ionicons";
import { Modal } from "@telegram-apps/telegram-ui";
import { ModalHeader } from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";
import { useTranslation } from "react-i18next"; // i18n kullanımı için import

const BoostComponent = () => {
  const [isConnected, setIsConnected] = useState(false);
  const { t } = useTranslation(); // i18n'den metinleri almak için

  const handleBoostPurchase = (level: number) => {
    // Boost satın alma işlemi
    console.log(level);
  };

  const handleConnect = () => {
    setIsConnected(true);
  };

  return (
    <div className="flex w-full items-end justify-end ">
      <Modal
        header={<ModalHeader>{t("boost_options")}</ModalHeader>}
        trigger={
          <div className="flex cursor-pointer gap-1">
            <span className="text-[15px]">
              <Rocket cssClasses={"!fill-[#c25918]"} />
            </span>
            <span className="text-[15px] font-semibold">{t("boost")}</span>
          </div>
        }
        className="z-50"
      >
        <div className="p-4 bg-[#1e1e1e] rounded-2xl">
          <p className="text-lg font-semibold text-white">
            {t("boost_options")}
          </p>

          {/* Boost Level 1 */}
          <div className="flex justify-between items-center bg-[#2b2f36] p-3 rounded-lg mt-4">
            <div className="text-sm flex flex-col">
              <p className="text-gray-400">{t("level1")}</p>
              <p className="text-sm text-[#c25918]">
                {t("boost_level1_description")}
              </p>
              <p className="text-xs text-gray-400">{t("cost")}: 100 HP</p>
            </div>
            <button
              className="bg-[#c25918]/70 text-white px-4 py-2 rounded-lg hover:bg-[#c25918]/90 transition-all text-sm"
              onClick={() => handleBoostPurchase(1)}
            >
              {t("buy")}
            </button>
          </div>

          {/* Boost Level 2 */}
          <div className="flex justify-between items-center bg-[#2b2f36] p-3 rounded-lg mt-2">
            <div className="text-sm flex flex-col">
              <p className="text-gray-400">{t("level2")}</p>
              <p className="text-sm text-[#c25918]">
                {t("boost_level2_description")}
              </p>
              <p className="text-xs text-gray-400">{t("cost")}: 5 TON</p>
            </div>
            <button
              className="bg-[#c25918]/70 text-white px-4 py-2 rounded-lg hover:bg-[#c25918]/90 transition-all text-sm"
              onClick={() => handleConnect()}
            >
              {isConnected ? t("buy") : t("connect")}
            </button>
          </div>

          {/* Boost Level 3 */}
          <div className="flex justify-between items-center bg-[#2b2f36] p-3 rounded-lg mt-2">
            <div className="text-sm flex flex-col">
              <p className="text-gray-400">{t("level3")}</p>
              <p className="text-sm text-[#c25918]">
                {t("boost_level3_description")}
              </p>
              <p className="text-xs text-gray-400">{t("cost")}: 15 TON</p>
            </div>
            <button
              className="bg-[#c25918]/70 text-white px-4 py-2 rounded-lg hover:bg-[#c25918]/90 transition-all text-sm"
              onClick={() => handleConnect()}
            >
              {isConnected ? t("buy") : t("connect")}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BoostComponent;
