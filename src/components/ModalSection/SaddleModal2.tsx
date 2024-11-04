import { useState } from "react";
import { Modal } from "@telegram-apps/telegram-ui";
import { ModalHeader } from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";
import { greenSaddleIcon } from "../../images";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";

import { RootState } from "../../store";

const SaddleModal2 = ({ title }: { title: string }) => {
  const [isPurchased] = useState(false);
  const [loading] = useState(false);
  const { t } = useTranslation();

  const user = useSelector((state: RootState) => state.user.user);

  const ton_amount = user?.ton_amount || 0;

  const handleItemPurchase = async () => {};

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
              <p className="text-sm text-[#c25918]"> {t("buy_saddle_2")}</p>
            </div>
            <button
              className="bg-[#c25918]/70 text-white px-4 py-2 rounded-lg hover:bg-[#c25918]/90 transition-all text-sm flex items-center justify-center"
              onClick={handleItemPurchase}
              disabled={loading || isPurchased || ton_amount < 5}
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
