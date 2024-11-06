import { Modal } from "@telegram-apps/telegram-ui";
import { ModalHeader } from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";
import { useState, useEffect } from "react";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { donateIcon } from "../../images";
import useToast from "../../hooks/useToast";
import { useTelegram } from "../../context/TelegramContext";

const DonateModal = () => {
  const [amount, setAmount] = useState("");
  const { handleVibrate } = useTelegram();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [isThankYouVisible, setThankYouVisible] = useState(false);
  const [tonConnectUI] = useTonConnectUI();
  const { success, error } = useToast();
  const wallet = useTonWallet();

  const handleDeposit = () => {
    const donationAmount = selectedAmount || parseFloat(amount);
    handleVibrate();
    if (!donationAmount || isNaN(donationAmount)) {
      error("Please enter a valid amount of at least 5 TON.");
      return;
    }

    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 60,
      messages: [
        {
          address: "UQCno9l-CqGgg6j6MyDsWV75NwFdzqAAPxE3OIwwzR8YH7bt",
          amount: (donationAmount * 1e9).toString(),
        },
      ],
    };

    tonConnectUI
      .sendTransaction(transaction)
      .then(() => {
        success("Donete successful!");
        setAmount("");
        setSelectedAmount(null);
        setThankYouVisible(true);
      })
      .catch((err) => error(`Something went wrong: ${err.message}`));
  };

  useEffect(() => {
    if (isThankYouVisible) {
      const timer = setTimeout(() => setThankYouVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isThankYouVisible]);

  return (
    <div>
      <Modal
        header={<ModalHeader>Support Us</ModalHeader>}
        trigger={
          <div
            onClick={handleVibrate}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 rounded-lg flex items-center justify-between shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200"
          >
            <p className="text-white font-semibold">Support Us</p>
            <div className="flex items-center space-x-2">
              <img src={donateIcon} alt="Donate" className="w-8 h-8" />
            </div>
          </div>
        }
        className="z-50"
      >
        <div className="p-8 bg-[#161616] rounded-2xl min-h-[400px] flex flex-col items-center shadow-2xl space-y-6 text-center text-white">
          {isThankYouVisible ? (
            <h3 className="text-2xl font-bold text-green-500">
              Thank you for your generous support! 🎉
            </h3>
          ) : wallet ? (
            <div className="w-full flex flex-col items-center space-y-4">
              <h3 className="text-xl font-bold">Help Us Grow!</h3>
              <p className="text-sm text-gray-400">
                Your donations support our mission to provide valuable resources
                and tools for our community. Every contribution makes a
                difference. Thank you for being a part of our journey!
              </p>

              <div className="flex space-x-3">
                {[5, 10, 50].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => {
                      setSelectedAmount(amt);
                      setAmount("");
                      handleVibrate();
                    }}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      selectedAmount === amt
                        ? "bg-purple-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white"
                    }`}
                  >
                    {amt} TON
                  </button>
                ))}
              </div>

              <div className="mt-4 w-full">
                <input
                  type="text"
                  placeholder="Or enter custom amount (min 5 TON)"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setSelectedAmount(null);
                  }}
                  className="w-full bg-[#282828] text-white p-3 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
              <button
                onClick={handleDeposit}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-all"
              >
                Donate TON
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center space-y-4">
              <p className="text-lg font-medium">
                Connect Your Wallet to Donate
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default DonateModal;
