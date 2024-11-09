import React, { useState } from "react";
import { Modal } from "@telegram-apps/telegram-ui";
import { ModalHeader } from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import useToast from "../../hooks/useToast";
import ClipLoader from "react-spinners/ClipLoader";
import { updateUser } from "../../store/slices/userSlice";
import { greenSaddleIcon, saddleIcon } from "../../images";

interface MarketItemModalProps {
  item_name: string;
  item_slug: string;
  reputation_points: number;
  id: any;
}

const SellItemModal: React.FC<MarketItemModalProps> = ({
  item_slug,
  item_name,
  reputation_points,
  id,
}) => {
  const [price, setPrice] = useState<number | "">("");
  const [isPurchased, setIsPurchased] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { success, error } = useToast();
  const dispatch = useDispatch();

  // Redux: Get user data
  const user = useSelector((state: RootState) => state.user.user);
  const telegramId = user?.telegram_id;

  const handleItemPurchase = async () => {
    setLoading(true);

    try {
      const uuidString = id.toString(); // Convert Binary to UUID string here
      console.log(uuidString, id);

      const response = await fetch("http://localhost:8000/market", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          item_name,
          item_slug,
          reputation_points,
          price,
          seller: telegramId,
        }),
      });

      if (!response.ok) throw new Error("Failed to sell item");
      const data = await response.json();

      success(t("add_market_success_message"));
      setIsPurchased(true);
      dispatch(updateUser(data.result));
    } catch (err) {
      error(t("add_market_errorn_message"));
      console.error("Error adding item to market:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Modal
        header={<ModalHeader>Sell {item_name}</ModalHeader>}
        trigger={
          <div>
            <button className="text-[#c25918] w-20 rounded-md text-sm border border-[#c25918] py-1 px-1 mb-2">
              Sell
            </button>

            <img
              src={item_slug === "saddleIcon" ? saddleIcon : greenSaddleIcon}
              alt={item_name}
              className="w-12 h-12 mb-1 ml-8"
            />

            {/* Item Name and Reputation Points */}
            <div className="flex flex-col items-center text-center">
              <span className="text-white text-xs">{item_name}</span>
              <span className="text-[#f5a623] text-xs font-semibold">
                {reputation_points} RP
              </span>
            </div>
          </div>
        }
        className="z-50"
      >
        <div className="p-8 bg-[#1e1e1e] rounded-2xl min-h-[250px] flex flex-col justify-between items-center">
          <p className="text-lg text-white mb-4">
            What is the price you are asking for {item_name}?
          </p>

          {/* Price Input */}
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="Enter the amount of TON"
            className="w-full bg-[#333] text-white p-2 rounded mb-4 outline-none"
          />

          <button
            className="bg-[#c25918] text-white py-2 px-4 rounded-lg text-sm flex items-center justify-center"
            onClick={handleItemPurchase}
            disabled={loading || isPurchased}
          >
            {loading ? <ClipLoader color="#ffffff" size={20} /> : t("Sell")}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SellItemModal;
