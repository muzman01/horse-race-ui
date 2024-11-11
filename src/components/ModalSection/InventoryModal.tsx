import { Modal } from "@telegram-apps/telegram-ui";
import { ModalHeader } from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTelegram } from "../../context/TelegramContext";
import { gamePassIcon, inventoryIcon } from "../../images";
import SellItemModal from "./SellItemModa";

const InventoryModal = () => {
  const { t } = useTranslation();

  const { handleVibrate } = useTelegram();

  const user_item =
    useSelector((state: RootState) => state?.user?.user?.items) || [];
  const ton_amount =
    useSelector((state: RootState) => state?.user?.user?.ton_amount) || 0;
  const reputation_points =
    useSelector((state: RootState) => state?.user?.user?.reputation_points) ||
    0;
  const total_reputation_points =
    reputation_points +
    user_item.reduce(
      (total: number, item: any) => total + (item.reputation_points || 0),
      0
    );

  const game_pass =
    useSelector((state: RootState) => state?.user?.user?.game_pass) || 0;
  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
  };
  return (
    <div>
      <Modal
        header={<ModalHeader>Inventory</ModalHeader>}
        trigger={
          <div
            onClick={handleVibrate}
            className="bg-gradient-to-r from-red-600 to-yellow-500 p-4 rounded-lg flex items-center justify-between shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200"
          >
            <p className="text-white font-semibold">Inventory</p>
            <div className="flex items-center space-x-2">
              <img src={inventoryIcon} alt="Sword" className="w-8 h-8" />
            </div>
          </div>
        }
        className="z-50"
      >
        <div className="p-6 bg-[#1e1e1e] rounded-2xl min-h-[350px] flex flex-col items-center shadow-xl space-y-6">
          <div className="flex flex-col items-center opacity-90 mt-12 w-full">
            <div className="text-lg font-bold text-[#f5a623]">
              {t("inventory")}
            </div>
            <div className="flex justify-center w-full mt-8">
              <Slider {...sliderSettings} className="w-full max-w-xs">
                {user_item.map((item: any, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center gap-1"
                    style={{ width: "80px" }}
                  >
                    <SellItemModal
                      item_name={item.item_name}
                      item_slug={item.item_slug}
                      reputation_points={item.reputation_points}
                      id={item.id}
                      key={index}
                    />
                  </div>
                ))}
              </Slider>
            </div>

            {/* Toplam İtibar Puanı ve HP */}
            <div className="flex justify-between w-full px-4 py-2 border-t border-[#f5a623] mt-4">
              <div className="text-white text-xs">
                {t("reputation_points")}:{" "}
                <span className="font-bold">{total_reputation_points}</span>
              </div>
              <div className="text-white text-xs">
                {t("total_ton")}:{" "}
                <span className="font-bold"> {ton_amount.toFixed(4)} TON</span>
              </div>
              <div className="text-white text-xs flex flex-row">
                <span className="font-bold">GP: </span>
                <img src={gamePassIcon} alt="gamepass" className="w-4 h-4" />
                <span>{game_pass}</span>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InventoryModal;
