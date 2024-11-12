import { Modal } from "@telegram-apps/telegram-ui";
import { ModalHeader } from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";
import { useTranslation } from "react-i18next"; // i18n'den metinleri almak için
import { useState } from "react";
import { useTelegram } from "../../context/TelegramContext";

const LanguageModal = () => {
  const { t, i18n } = useTranslation(); // i18n'den metinleri almak için
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const { handleVibrate } = useTelegram();
  const changeLanguage = (lang: string) => {
    handleVibrate();
    i18n.changeLanguage(lang);
    setSelectedLanguage(lang);
  };

  return (
    <div>
      <Modal
        header={<ModalHeader>{t("select_language")}</ModalHeader>}
        trigger={
          <div
            onClick={handleVibrate}
            className="bg-[#2b2f36] p-4 rounded-lg flex items-center justify-between"
          >
            <p className="text-gray-300">{t("language")}</p>
            <div className="flex items-center space-x-2">
              <p>{selectedLanguage === "tr" ? t("turkish") : t("English")}</p>
              <img
                src={
                  selectedLanguage === "tr"
                    ? "https://upload.wikimedia.org/wikipedia/commons/b/b4/Flag_of_Turkey.svg"
                    : "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/400px-Flag_of_the_United_Kingdom_%283-5%29.svg.png"
                } // Bayrak değişimi
                alt={t("turkey_flag_alt")}
                className="w-6 h-4"
              />
            </div>
          </div>
        }
        className="z-50"
      >
        <div className="p-8 bg-[#1e1e1e] rounded-2xl min-h-[250px] flex flex-col items-center">
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => changeLanguage("tr")}
              className={`flex items-center justify-center p-2 rounded w-full ${
                selectedLanguage === "tr" ? "bg-blue-500" : "bg-gray-700"
              }`}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/b/b4/Flag_of_Turkey.svg"
                alt="Türk Bayrağı"
                className="w-6 h-4 mr-2"
              />
              Türkçe
            </button>
            <button
              onClick={() => changeLanguage("en")}
              className={`flex items-center justify-center p-2 rounded w-full ${
                selectedLanguage === "en" ? "bg-blue-500" : "bg-gray-700"
              }`}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/400px-Flag_of_the_United_Kingdom_%283-5%29.svg.png"
                alt="English Flag"
                className="w-6 h-4 mr-2"
              />
              English
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LanguageModal;
