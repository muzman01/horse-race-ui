// components/TaskInfoModal.tsx
import { Modal } from "@telegram-apps/telegram-ui";
import { ModalHeader } from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";
import { useTelegram } from "../../context/TelegramContext";

const TaskInfoModal = () => {
  const { handleVibrate } = useTelegram();
  return (
    <div className="flex w-full items-end justify-end">
      <Modal
        header={<ModalHeader>Referral Rewards</ModalHeader>}
        trigger={
          <button
            onClick={handleVibrate}
            className="w-full bg-[#c25918] text-white rounded-2xl py-3 mt-4 active:scale-95 transition-all"
          >
            Learn more
          </button>
        }
        className="z-50"
      >
        <div className="mt-2 max-h-[400px] overflow-y-auto p-4 text-tg-text-color">
          <p className="text-sm/6 opacity-60 mb-4">
            Our referral system offers a multi-level structure, allowing you to
            earn rewards as you expand your network. Here’s how it works:
          </p>
          <p className="text-sm/6 mb-1">
            <span className="font-semibold opacity-100">Level 1:</span>{" "}
            <span className="opacity-60">
              For every 5 friends who register using your referral link, you
              earn a game pass. This pass grants you entry into a race where you
              can compete and win exciting rewards.
            </span>
          </p>
          <p className="text-sm/6 mb-1">
            <span className="font-semibold opacity-100">Level 2:</span>{" "}
            <span className="opacity-60">
              Once you refer 100 friends, you will receive an additional reward
              of 5 TON as a bonus.
            </span>
          </p>
          <p className="text-sm/6 mb-1">
            <span className="font-semibold opacity-100">Level 3:</span>{" "}
            <span className="opacity-60">
              When you reach 500 referrals, you earn a bonus of 15 TON as a
              special reward for your efforts.
            </span>
          </p>
          <p className="text-sm/6 opacity-60 mt-4">
            Please note that each level must be completed in sequence to unlock
            the next. So, start with Level 1, and as your network grows, you
            will progress through higher reward levels. You earn not only for
            your direct invitations but also for the growing activity of your
            network.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default TaskInfoModal;
