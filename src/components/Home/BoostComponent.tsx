import { Rocket } from "react-ionicons";
import { Modal } from "@telegram-apps/telegram-ui";
import { ModalHeader } from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";
import { useTranslation } from "react-i18next"; // i18n kullanımı için import
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import useToast from "../../hooks/useToast";
import { setUser } from "../../store/slices/userSlice";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const BoostComponent = () => {
  const { t } = useTranslation(); // i18n'den metinleri almak için
  const { success, error } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false); // Yüklenme durumu için
  const telegram_id: any = useSelector(
    (state: RootState) => state?.user?.user?.telegram_id
  );
  const boosts: any = useSelector(
    (state: RootState) => state?.user?.user?.boost
  );
  const user = useSelector((state: RootState) => state.user.user);

  const ton_amount = user?.ton_amount || 0;
  const hp_amount = user?.hp || 0;
  const currentBoostLevel = boosts?.level || 0; // Mevcut boost seviyesini al
  const fetchUser = async () => {
    const response: any = await fetch(
      `${API_BASE_URL}/users/${telegram_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    dispatch(setUser(data.result));
  };
  const handleBoostPurchase = async (level: number) => {
    const boostData: any | undefined = {
      1: { currency_type: "hp", amount: 100 },
      2: { currency_type: "ton", amount: 5 },
      3: { currency_type: "ton", amount: 15 },
    }[level];

    if (!boostData) return; // Geçersiz seviye varsa çıkış yap

    setLoading(true); // Yüklenme durumu başlat
    try {
      const response: any = await fetch(`${API_BASE_URL}/apply_boost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          telegram_id: telegram_id,
          requested_level: level,
          ...boostData,
        }),
      });

      if (response.ok) {
        success("Boost implemented successfully");
        fetchUser();
      } else {
        error("Boost application failed.");
      }
    } catch (error: any) {
      error("Boost application failed.");
    } finally {
      setLoading(false); // Yüklenme durumunu durdur
    }
  };

  return (
    <div className="flex w-full items-end justify-end">
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
        <div className="p-4 bg-[#1e1e1e] min-h-[450px] rounded-2xl">
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
            {currentBoostLevel === 1 ? (
              <span className="text-green-500 font-semibold">
                {t("active")}
              </span>
            ) : (
              <div>
                <button
                  className="bg-[#c25918]/70 text-white px-4 py-2 rounded-lg hover:bg-[#c25918]/90 transition-all text-sm"
                  onClick={() => handleBoostPurchase(1)}
                  disabled={loading || currentBoostLevel > 0 || hp_amount < 100}
                >
                  {loading ? t("loading") : t("buy")}
                </button>
                {hp_amount < 100 && (
                  <p className="text-xs text-red-500 mt-2">
                    {t("not_enough_hp")}
                  </p>
                )}
              </div>
            )}
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
            {currentBoostLevel === 2 ? (
              <span className="text-green-500 font-semibold">
                {t("active")}
              </span>
            ) : (
              <div>
                <button
                  className="bg-[#c25918]/70 text-white px-4 py-2 rounded-lg hover:bg-[#c25918]/90 transition-all text-sm"
                  onClick={() => handleBoostPurchase(2)}
                  disabled={loading || currentBoostLevel >= 2 || ton_amount < 5}
                >
                  {loading ? t("loading") : t("buy")}
                </button>
                {ton_amount < 5 && (
                  <p className="text-xs text-red-500 mt-2">
                    {t("not_enough_ton")}
                  </p>
                )}
              </div>
            )}
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
            {currentBoostLevel === 3 ? (
              <span className="text-green-500 font-semibold">
                {t("active")}
              </span>
            ) : (
              <div>
                <button
                  className="bg-[#c25918]/70 text-white px-4 py-2 rounded-lg hover:bg-[#c25918]/90 transition-all text-sm"
                  onClick={() => handleBoostPurchase(3)}
                  disabled={
                    loading || currentBoostLevel >= 3 || ton_amount < 15
                  }
                >
                  {loading ? t("loading") : t("buy")}
                </button>
                {ton_amount < 15 && (
                  <p className="text-xs text-red-500 mt-2">
                    {t("not_enough_ton")}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BoostComponent;
