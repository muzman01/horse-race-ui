import { useEffect, useState } from "react";
import { Rocket } from "react-ionicons";
import { Modal, Placeholder } from "@telegram-apps/telegram-ui";
import { ModalHeader } from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";

const BoostComponent = () => {
  const [isConnected, setIsConnected] = useState(false);
  const handleBoostPurchase = (level: number) => {
    // Burada boost satın alma işlemi yapılacak
    console.log(`Boost Level ${level} purchased!`);
  };
  const handleConnect = () => {
    setIsConnected(true);
    // Burada WebSocket ile boost sunucusuna bağlanılacak
    // ...
  };
  return (
    <div className="flex w-full items-end justify-end ">
      <Modal
        header={<ModalHeader>Boost Options</ModalHeader>}
        trigger={
          <div className="flex cursor-pointer gap-1">
            <span className="text-[15px]">
              <Rocket cssClasses={"!fill-[#c25918]"} />
            </span>
            <span className="text-[15px] font-semibold">Boost</span>
          </div>
        }
        className="z-50"
      >
        <div className="p-4 bg-[#1e1e1e] rounded-2xl">
          <p className="text-lg font-semibold text-white">Boost Options</p>

          {/* Boost Level 1 */}
          <div className="flex justify-between items-center bg-[#2b2f36] p-3 rounded-lg mt-4">
            <div className="text-sm flex flex-col">
              <p className="text-gray-400">Level 1</p>
              <p className="text-sm text-[#c25918]">+2 Click Power for 1 Day</p>
              <p className="text-xs text-gray-400">Cost: 100 HP</p>
            </div>
            <button
              className="bg-[#c25918]/70 text-white px-4 py-2 rounded-lg hover:bg-[#c25918]/90 transition-all text-sm"
              onClick={() => handleBoostPurchase(1)}
            >
              Buy
            </button>
          </div>

          {/* Boost Level 2 */}
          <div className="flex justify-between items-center bg-[#2b2f36] p-3 rounded-lg mt-2">
            <div className="text-sm flex flex-col">
              <p className="text-gray-400">Level 2</p>
              <p className="text-sm text-[#c25918]">
                +10 Click Power for 3 Days
              </p>
              <p className="text-xs text-gray-400">Cost: 5 TON</p>
            </div>
            <button
              className="bg-[#c25918]/70 text-white px-4 py-2 rounded-lg hover:bg-[#c25918]/90 transition-all text-sm"
              onClick={() => handleConnect()}
            >
              {isConnected ? "Buy" : "Connect"}
            </button>
          </div>

          {/* Boost Level 3 */}
          <div className="flex justify-between items-center bg-[#2b2f36] p-3 rounded-lg mt-2">
            <div className="text-sm flex flex-col">
              <p className="text-gray-400">Level 3</p>
              <p className="text-sm text-[#c25918]">
                +20 Click Power for 10 Days
              </p>
              <p className="text-xs text-gray-400">Cost: 15 TON</p>
            </div>
            <button
              className="bg-[#c25918]/70 text-white px-4 py-2 rounded-lg hover:bg-[#c25918]/90 transition-all text-sm"
              onClick={() => handleConnect()}
            >
              {isConnected ? "Buy" : "Connect"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BoostComponent;
