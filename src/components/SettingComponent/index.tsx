import { useSelector } from "react-redux";
import { copyIconWhite, nullUserIcon, tonIcon } from "../../images";
import { useTranslation } from "react-i18next"; // i18n kullanımı için import
import { RootState } from "../../store";
import useToast from "../../hooks/useToast";
import LanguageModal from "../ModalSection/LanguageModal";
import ConverModal from "../ModalSection/ConverModal";
import LeaderBoard from "../ModalSection/LeaderBoard";

const SettingsComponent = () => {
  const { t } = useTranslation(); // i18n'den metinleri almak için
  const { success } = useToast();
  const telegram_id: any = useSelector(
    (state: RootState) => state?.user?.user?.telegram_id
  );
  const user_name = useSelector(
    (state: RootState) => state?.user?.user?.username
  );
  const referralLink = `https://t.me/horse_race_muzman_bot?start=${telegram_id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      success(t("success_copy"));
    });
  };
  const handleCopyId = () => {
    navigator.clipboard.writeText(telegram_id).then(() => {
      success(t("success_copy"));
    });
  };
  return (
    <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] text-white min-h-screen p-4">
      {/* Header */}
      <div className="bg-[#2b2f36] p-4 rounded-lg flex items-center justify-between mb-6">
        <div>
          <p className="text-lg">{t("hello")}</p>
          <p className="text-2xl font-bold">{user_name}</p>
        </div>
        <div className="bg-gray-700 rounded-full p-2">
          <img src={nullUserIcon} className="rounded-full w-12 h-12" />
        </div>
      </div>

      {/* Wallet Button with white lines */}
      <div className="border-t border-b border-gray-700 items-center justify-center pt-4">
        <button className="w-full gap-2 bg-[#2b2f36] text-white py-3 rounded-lg flex items-center justify-center mb-4">
          <div className="bg-gray-700 rounded-full p-1">
            <img src={tonIcon} className="rounded-full w-8 h-8" />
          </div>
          {t("connect_wallet")}
        </button>
      </div>

      {/* Options - Box Styles */}
      <div className="space-y-4 mt-4">
        {/* Benim ID */}
        <div className="bg-[#2b2f36] p-4 rounded-lg flex items-center justify-between">
          <p className="text-gray-300">{t("telegram_id")}</p>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyId}
              className="p-1 rounded cursor-pointer"
            >
              <img src={copyIconWhite} className="" />
            </button>

            <p>{telegram_id}</p>
          </div>
        </div>

        {/* Dil */}
        <LanguageModal />

        {/* Arkadaşlarını Davet Et */}
        <div
          onClick={handleCopy}
          className="bg-[#2b2f36] p-4 rounded-lg flex items-center cursor-pointer"
        >
          <p className="text-gray-300">{t("invite_friend")}</p>
        </div>
        <ConverModal />
        <LeaderBoard />
      </div>
    </div>
  );
};

export default SettingsComponent;
