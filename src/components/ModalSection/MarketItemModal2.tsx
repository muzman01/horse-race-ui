import React, { useState } from "react";
import { Modal, Placeholder } from "@telegram-apps/telegram-ui";
import { ModalHeader } from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";

const MarketItemModal2 = ({ title }: { title: string }) => {
  const [isPurchased, setIsPurchased] = useState(false);

  const handleItemPurchase = () => {
    setIsPurchased(true);
    // Burada satın alma işlemi yapılacak
    console.log(`${title} satın alındı!`);
  };
  return (
    <div>
      <Modal
        header={<ModalHeader>{title}</ModalHeader>}
        trigger={
          <button className="bg-[#c25918] text-white w-28 rounded-2xl py-2 px-4">
            Buy
          </button>
        }
        className="z-50"
      >
        <div className="p-8 bg-[#1e1e1e] rounded-2xl min-h-[250px] flex flex-col justify-between">
          <p className="text-lg font-semibold text-white">{title}</p>
          <p className="text-sm text-gray-400 mt-2">
            {title} satın almak üzeresiniz. Devam etmek istiyor musunuz?
          </p>

          {/* Satın Alma Butonu */}
          <div className="flex justify-between items-center bg-[#2b2f36] p-3 rounded-lg mt-8">
            <div className="text-sm flex flex-col">
              <p className="text-gray-400">Fiyat: 200 HP</p>
              <p className="text-sm text-[#c25918]">Bu ürünü satın alın.</p>
            </div>
            <button
              className={`bg-[#c25918]/70 text-white px-4 py-2 rounded-lg hover:bg-[#c25918]/90 transition-all text-sm`}
              onClick={handleItemPurchase}
            >
              {isPurchased ? "Purchased" : "Buy"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MarketItemModal2;
