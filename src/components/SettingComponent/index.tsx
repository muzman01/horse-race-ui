import { useDispatch, useSelector } from "react-redux";
import { copyIconWhite, nullUserIcon } from "../../images";
import { useTranslation } from "react-i18next";
import { RootState } from "../../store";
import useToast from "../../hooks/useToast";
import {
  TonConnectButton,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import LanguageModal from "../ModalSection/LanguageModal";
import ConverModal from "../ModalSection/ConverModal";
import LeaderBoard from "../ModalSection/LeaderBoard";
import { useState } from "react";
import { updateTonAmount } from "../../store/slices/userSlice";
import DonateModal from "../ModalSection/DonateModal";

const SettingsComponent = () => {
  const { t } = useTranslation();
  const { success, error } = useToast();
  const dispatch = useDispatch();
  const telegram_id: any = useSelector(
    (state: RootState) => state?.user?.user?.telegram_id
  );
  const user_name = useSelector(
    (state: RootState) => state?.user?.user?.username
  );
  const referralLink = `https://t.me/horse_race_muzman_bot?start=${telegram_id}`;
  const [amount, setAmount] = useState("");
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      success(t("success_copy"));
    });
  };
  const handleCopyId = () => {
    navigator.clipboard.writeText(telegram_id).then(() => {
      success(t("success_copy"));
    });
  };

  const handleDeposit = () => {
    if (!amount || isNaN(Number(amount))) {
      error("Please enter a valid amount.");
      return;
    }

    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 60,
      messages: [
        {
          address: "UQCno9l-CqGgg6j6MyDsWV75NwFdzqAAPxE3OIwwzR8YH7bt",
          amount: (parseFloat(amount) * 1e9).toString(),
        },
      ],
    };

    tonConnectUI
      .sendTransaction(transaction)
      .then(() => {
        return fetch("http://localhost:8000/deposit_ton", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            telegram_id,
            ton_amount: Number(amount),
          }),
        });
      })
      .then((response) => {
        if (response.ok) {
          dispatch(updateTonAmount(Number(amount)));
          success("Deposit successfully");
          setAmount("");
        } else {
          error("Someting Went Wrong!");
        }
      })
      .catch((err) => error(`Someting Went Wrong: ${err.message}`));
  };

  const handleDisconnect = () => {
    tonConnectUI.disconnect();
    success("Disconnected from wallet");
  };

  return (
    <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] text-white min-h-screen p-4">
      {/* Header */}
      <div className="bg-[#2b2f36] p-4 rounded-lg flex items-center justify-between mb-6">
        <div>
          <p className="text-lg">{t("hello")}</p>
          <p className="text-2xl font-bold">{user_name}</p>
        </div>
        <div className="bg-gray-700 rounded-full p-2">
          <img src={nullUserIcon} className="rounded-full w-12 h-12" />
        </div>
      </div>

      {/* Wallet Button with white lines */}
      <div className="border-t border-b border-gray-700 items-center justify-center pt-4">
        {wallet ? (
          <div className="border-t border-b border-gray-700 items-center justify-center pt-4 mt-4">
            <input
              type="text"
              placeholder="Deposit Amount (TON)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-[#1a1a1a] text-white p-3 rounded-lg mb-4"
            />
            <button
              onClick={handleDeposit}
              className="w-full bg-blue-500 text-white py-3 rounded-lg"
            >
              Deposit
            </button>
            <button
              onClick={handleDisconnect}
              className="w-full bg-red-500 text-white py-3 rounded-lg mt-4"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button className="w-full gap-2 bg-[#2b2f36] text-white py-3 rounded-lg flex items-center justify-center mb-4">
            <TonConnectButton />
          </button>
        )}
      </div>

      {/* Options - Box Styles */}
      <div className="space-y-4 mt-4">
        {/* Benim ID */}
        <div className="bg-[#2b2f36] p-4 rounded-lg flex items-center justify-between">
          <p className="text-gray-300">{t("telegram_id")}</p>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyId}
              className="p-1 rounded cursor-pointer"
            >
              <img src={copyIconWhite} className="" />
            </button>

            <p>{telegram_id}</p>
          </div>
        </div>

        {/* Dil */}
        <LanguageModal />

        {/* Arkadaşlarını Davet Et */}
        <div
          onClick={handleCopy}
          className="bg-[#2b2f36] p-4 rounded-lg flex items-center cursor-pointer"
        >
          <p className="text-gray-300">{t("invite_friend")}</p>
        </div>
        <ConverModal />
        <DonateModal />
        <LeaderBoard />
      </div>
    </div>
  );
};

export default SettingsComponent;
