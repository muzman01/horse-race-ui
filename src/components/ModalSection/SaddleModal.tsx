import { useState } from "react";
import { Modal } from "@telegram-apps/telegram-ui";
import { ModalHeader } from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";
import { saddleIcon } from "../../images";
import { useTranslation } from "react-i18next";
import ClipLoader from "react-spinners/ClipLoader";
import useToast from "../../hooks/useToast"; // Toast mesajları için
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { updateUser } from "../../store/slices/userSlice";

const SaddleModal = ({ title }: { title: string }) => {
  const [isPurchased, setIsPurchased] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { success, error } = useToast();
  const telegram_id = useSelector(
    (state: RootState) => state?.user?.user?.telegram_id
  );
  // Kullanıcının mevcut HP miktarını Redux'tan alın
  const userHp = useSelector((state: RootState) => state.user.user?.hp) || 0;

  const handleItemPurchase = async () => {
    const requiredHp = 200; // Gerekli HP miktarı

    // HP yeterli değilse uyarı göster ve işlemi durdur
    if (userHp < requiredHp) {
      error(t("not_enough_hp"));
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/buy_item_sistem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          item_name: title,
          item_slug: "saddleIcon", // Örnek slug, gerekirse dinamik hale getirin
          reputation_points: 500,
          telegram_id: telegram_id, // Gerçek telegram_id'yi kullanın
          hp: requiredHp, // Satın alma için gerekli HP miktarı
        }),
      });

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
          <img src={saddleIcon} alt={title} className="w-20 h-20 mb-4" />

          <p className="text-lg font-semibold text-white">{title}</p>
          <p className="text-sm text-gray-400 mt-2 text-center">
            {title} {t("buy_saddle")}
          </p>

          <div className="flex justify-between items-center bg-[#2b2f36] p-3 rounded-lg mt-8 w-full max-w-xs">
            <div className="text-sm flex flex-col">
              <p className="text-gray-400">{t("price")}: 200 HP</p>
              {!isPurchased && (
                <p className="text-sm text-[#c25918]"> {t("buy_saddle_2")}</p>
              )}
            </div>
            <button
              className="bg-[#c25918]/70 text-white px-4 py-2 rounded-lg hover:bg-[#c25918]/90 transition-all text-sm flex items-center justify-center"
              onClick={handleItemPurchase}
              disabled={loading || isPurchased || userHp < 200}
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
          {userHp < 200 && (
            <p className="text-xs text-red-500 mt-2">{t("not_enough_hp")}</p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default SaddleModal;
