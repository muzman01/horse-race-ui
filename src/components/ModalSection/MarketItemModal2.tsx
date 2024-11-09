import React, { useState } from "react";
import { Modal } from "@telegram-apps/telegram-ui";
import { ModalHeader } from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";
import { updateUser } from "../../store/slices/userSlice";
import { useTranslation } from "react-i18next";

import { useDispatch, useSelector } from "react-redux";
import useToast from "../../hooks/useToast";
import { RootState } from "../../store";
import { ClipLoader } from "react-spinners";

interface MarketItemModalProps {
  title: string;
  price: number; // HP olarak fiyat
}

const MarketItemModal2: React.FC<MarketItemModalProps> = ({ title, price }) => {
  const [isPurchased, setIsPurchased] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { success, error } = useToast();
  const dispatch = useDispatch();

  // Kullanıcı bilgilerini Redux'tan alıyoruz
  const user = useSelector((state: RootState) => state.user.user);
  const userHp = user?.ton_amount || 0;
  const telegramId = user?.telegram_id;

  const handleItemPurchase = async () => {
    if (!telegramId || userHp < price) {
      error("Yeterli HP yok!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://winroller.muzmanlive.com/buy_gamepass_with_ton",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            telegram_id: telegramId,
            hp: price,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Satın alma işlemi başarısız oldu");
      }

      const data = await response.json();

      // Başarılı satın alma
      success(t("buy_success_message"));
      setIsPurchased(true);
      dispatch(updateUser(data.result)); // Redux'ta kullanıcı bilgisini güncelle
    } catch (err) {
      error(t("buy_errorn_message"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Modal
        header={<ModalHeader>{title}</ModalHeader>}
        trigger={
          <button className="bg-[#c25918] text-white w-28 rounded-2xl py-2 px-4">
            {t("buy")}
          </button>
        }
        className="z-50"
      >
        <div className="p-8 bg-[#1e1e1e] rounded-2xl min-h-[250px] flex flex-col justify-between">
          <p className="text-lg font-semibold text-white">{title}</p>
          <p className="text-sm text-gray-400 mt-2">
            {title} {t("buy_saddle")}
          </p>

          {/* Satın Alma Butonu */}
          <div className="flex justify-between items-center bg-[#2b2f36] p-3 rounded-lg mt-8">
            <div className="text-sm flex flex-col">
              <p className="text-gray-400">
                {t("price")} {price} TON
              </p>
              <p className="text-sm text-[#c25918]"> {t("buy_saddle_2")}</p>
              {userHp < price && (
                <p className="text-xs text-red-500">{t("not_enough_ton")}</p>
              )}
            </div>
            <button
              className={`bg-[#c25918]/70 text-white px-4 py-2 rounded-lg hover:bg-[#c25918]/90 transition-all text-sm`}
              onClick={handleItemPurchase}
              disabled={isPurchased || loading || userHp < price}
            >
              {loading ? (
                <ClipLoader color="#ffffff" size={20} />
              ) : isPurchased ? (
                t("purchased")
              ) : (
                t("buy")
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MarketItemModal2;
