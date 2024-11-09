import { useState } from "react";
import { Modal } from "@telegram-apps/telegram-ui";
import { ModalHeader } from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";
import { greenSaddleIcon } from "../../images";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";

import { RootState } from "../../store";
import useToast from "../../hooks/useToast";
import { updateUser } from "../../store/slices/userSlice";

const SaddleModal2 = ({ title }: { title: string }) => {
  const [isPurchased, setIsPurchased] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { success, error } = useToast();
  const user = useSelector((state: RootState) => state.user.user);
  const telegram_id = useSelector(
    (state: RootState) => state?.user?.user?.telegram_id
  );
  const ton_amount = user?.ton_amount || 0;

  const handleItemPurchase = async () => {
    const requiredHp = 5; // Gerekli HP miktarı

    // HP yeterli değilse uyarı göster ve işlemi durdur
    if (ton_amount < requiredHp) {
      error(t("not_enough_hp"));
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://winroller.muzmanlive.com/buy_item_system_ton",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            item_name: title,
            item_slug: "greenSaddleIcon", // Örnek slug, gerekirse dinamik hale getirin
            reputation_points: 600,
            telegram_id: telegram_id, // Gerçek telegram_id'yi kullanın
            ton_amount: 5.0, // Satın alma için gerekli HP miktarı
          }),
        }
      );

      if (!response.ok) throw new Error("Purchase failed");

      const data = await response.json();
      success(t("buy_success_message"));
      dispatch(updateUser(data.result)); // Redux'ta kullanıcı bilgisini güncelle

      setIsPurchased(true);
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
        <div className="p-8 bg-[#1e1e1e] rounded-2xl min-h-[300px] flex flex-col items-center justify-between">
          <img src={greenSaddleIcon} alt={title} className="w-20 h-20 mb-4" />

          <p className="text-lg font-semibold text-white">{title}</p>
          <p className="text-sm text-gray-400 mt-2 text-center">
            {title} {t("buy_saddle")}
          </p>

          <div className="flex justify-between items-center bg-[#2b2f36] p-3 rounded-lg mt-8 w-full max-w-xs">
            <div className="text-sm flex flex-col">
              <p className="text-gray-400">{t("price")}: 5 TON</p>
              {!isPurchased && (
                <p className="text-sm text-[#c25918]"> {t("buy_saddle_2")}</p>
              )}
            </div>
            <button
              className="bg-[#c25918]/70 text-white px-4 py-2 rounded-lg hover:bg-[#c25918]/90 transition-all text-sm flex items-center justify-center"
              onClick={handleItemPurchase}
              disabled={loading || isPurchased || ton_amount < 5}
            >
              {loading ? (
                <ClipLoader color="#ffffff" size={20} />
              ) : isPurchased ? (
                "Purchased"
              ) : (
                t("buy")
              )}
            </button>
          </div>

          {/* HP Yetersizse Uyarı Mesajı */}
          {ton_amount < 5 && (
            <p className="text-xs text-red-500 mt-2">{t("not_enough_ton")}</p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default SaddleModal2;
