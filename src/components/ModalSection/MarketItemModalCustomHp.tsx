import React, { useState } from "react";
import { Modal } from "@telegram-apps/telegram-ui";
import { ModalHeader } from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import useToast from "../../hooks/useToast";
import ClipLoader from "react-spinners/ClipLoader";
import { updateUser } from "../../store/slices/userSlice";
import { useTelegram } from "../../context/TelegramContext";

interface MarketItemModalProps {
  title: string;
  price: number; // HP olarak fiyat
}

const MarketItemModalCustomHp: React.FC<MarketItemModalProps> = ({
  title,
  price,
}) => {
  const [isPurchased, setIsPurchased] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1); // Satın alınacak adet
  const { t } = useTranslation();
  const { success, error } = useToast();
  const dispatch = useDispatch();
  const { handleVibrate } = useTelegram();

  // Kullanıcı bilgilerini Redux'tan alıyoruz
  const user = useSelector((state: RootState) => state.user.user);
  const userHp = user?.hp || 0;
  const telegramId = user?.telegram_id;

  // Toplam fiyatı hesapla
  const totalPrice = price * quantity;

  const handleItemPurchase = async () => {
    handleVibrate();
    if (!telegramId || userHp < totalPrice) {
      error("Yeterli HP yok!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://winroller.muzmanlive.com/buy_gamepass",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            telegram_id: telegramId,
            hp: totalPrice, // Hesaplanan toplam fiyat gönderiliyor
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

      // Satın alma mesajı gösterildikten sonra butonu tekrar aktif hale getir
      setTimeout(() => setIsPurchased(false), 2000); // 2 saniye sonra tekrar "buy" olarak değiştir
    } catch (err) {
      error(t("buy_error_message"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Modal
        header={<ModalHeader>{title}</ModalHeader>}
        trigger={
          <button
            onClick={handleVibrate}
            className="bg-[#c25918] text-white w-28 rounded-2xl py-2 px-4"
          >
            {t("buy")}
          </button>
        }
        className="z-50"
      >
        <div className="p-8 bg-[#1e1e1e] rounded-2xl min-h-[250px] flex flex-col justify-between">
          <p className="text-lg font-semibold text-white">Game Pass Custom</p>
          <p className="text-sm text-gray-400 mt-2">
            You're about to purchase {quantity} Game Passes. Do you want to
            continue?
          </p>

          {/* Adet Input'u */}
          <div className="mt-4">
            <label htmlFor="quantity" className="text-gray-400 text-sm">
              {t("quantity")}:
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="bg-[#2b2f36] text-white p-2 rounded-lg ml-2 w-16 text-center"
              min="1"
            />
          </div>

          {/* Satın Alma Butonu */}
          <div className="flex justify-between items-center bg-[#2b2f36] p-3 rounded-lg mt-8">
            <div className="text-sm flex flex-col">
              <p className="text-gray-400">
                {t("price")} {totalPrice} HP
              </p>
              <p className="text-sm text-[#c25918]"> {t("buy_saddle_2")}</p>
              {userHp < totalPrice && (
                <p className="text-xs text-red-500">{t("not_enough_hp")}</p>
              )}
            </div>
            <button
              className={`bg-[#c25918]/70 text-white px-4 py-2 rounded-lg hover:bg-[#c25918]/90 transition-all text-sm`}
              onClick={handleItemPurchase}
              disabled={loading || userHp < totalPrice}
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

export default MarketItemModalCustomHp;
