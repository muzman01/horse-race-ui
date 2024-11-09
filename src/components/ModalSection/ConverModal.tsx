import { Modal } from "@telegram-apps/telegram-ui";
import { ModalHeader } from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import useToast from "../../hooks/useToast";
import ClipLoader from "react-spinners/ClipLoader";
import { updateUser } from "../../store/slices/userSlice";
import { useTelegram } from "../../context/TelegramContext";

const ConvertModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [convertAmount, setConvertAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { handleVibrate } = useTelegram();

  const click_score =
    useSelector((state: RootState) => state?.user?.user?.click_score) || 0;
  const telegram_id = useSelector(
    (state: RootState) => state?.user?.user?.telegram_id
  );
  const { success, error } = useToast();

  const handleConvertClick = async () => {
    handleVibrate();
    if (Number(convertAmount) > 0 && Number(convertAmount) <= click_score) {
      setLoading(true); // Yükleyiciyi göster
      try {
        const response = await fetch(
          "https://winroller.muzmanlive.com/convert",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              telegram_id: telegram_id,
              click_score: Number(convertAmount),
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to convert");
        }

        const data = await response.json();

        // Redux store'daki kullanıcıyı güncelle
        dispatch(updateUser(data.result));

        success(t("convert_success_message"));

        setConvertAmount(""); // Input alanını sıfırla
      } catch (err) {
        error(t("convert_errorn_message"));
      } finally {
        setLoading(false); // Yükleyiciyi kapat
      }
    }
  };

  const handleMaxClick = () => {
    handleVibrate();
    setConvertAmount(String(click_score));
  };

  return (
    <div>
      <Modal
        header={<ModalHeader>{t("convert")}</ModalHeader>}
        trigger={
          <div
            onClick={handleVibrate}
            className="bg-[#2b2f36] p-4 rounded-lg flex items-center cursor-pointer"
          >
            <p className="text-gray-300">HP {t("convert")}</p>
          </div>
        }
        className="z-50"
      >
        <div className="p-6 bg-[#1e1e1e] rounded-2xl min-h-[350px] flex flex-col items-center shadow-xl space-y-6">
          <h2 className="text-2xl font-bold text-[#c25918]">{t("convert")}</h2>
          <p className="text-gray-400 text-center max-w-md">
            {t("conver_amount")}:{" "}
            <p className="text-xl text-white">{click_score.toLocaleString()}</p>
          </p>

          <div className="w-full max-w-sm flex flex-col bg-[#2b2f36] p-6 rounded-lg shadow-inner space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder={t("enter_amount")}
                className="flex-1 text-center bg-transparent text-white placeholder-[#c25918]/80 text-lg border-b-2 border-[#f5a623] outline-none"
                value={convertAmount}
                onChange={(e) => setConvertAmount(e.target.value)}
              />
              <button
                className="bg-[#c25918] text-white px-2 py-1 rounded-lg font-semibold hover:bg-[#d2691e] transition-all"
                onClick={handleMaxClick}
              >
                Max
              </button>
            </div>
            <div className="text-white text-base mt-2 text-center">
              {t("hp_amount")}:{" "}
              <span className="font-semibold text-[#c25918]">
                {Number(convertAmount) / 1000 || 0}
              </span>
            </div>
          </div>

          <div className="w-full flex justify-center mt-10">
            <button
              className="w-full max-w-sm bg-[#c25918] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#d2691e] transition-all disabled:bg-gray-600 flex justify-center items-center"
              onClick={handleConvertClick}
              disabled={
                loading ||
                Number(convertAmount) <= 0 ||
                Number(convertAmount) > click_score
              }
            >
              {loading ? (
                <ClipLoader color="#ffffff" size={24} />
              ) : (
                t("convert")
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ConvertModal;
