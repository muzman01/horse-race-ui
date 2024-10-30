import { useEffect, useState } from "react";
import { Rocket } from "react-ionicons";
import { Modal, Placeholder } from "@telegram-apps/telegram-ui";
import { ModalHeader } from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";

const TaskInfoModal = () => {
  return (
    <div className="flex w-full items-end justify-end ">
      <Modal
        header={<ModalHeader> Referral Rewards</ModalHeader>}
        trigger={
          <button className="w-full bg-[#c25918] text-white rounded-2xl py-3 mt-4 active:scale-95 transition-all">
            Learn more
          </button>
        }
        className="z-50"
      >
        <div className="mt-2 max-h-[400px] overflow-y-auto">
          <p className="text-sm/6 text-tg-text-color opacity-60 mb-4">
            Our referral program has 3 levels of support, providing you with the
            opportunity to earn bonuses for inviting friends:
          </p>
          <p className="text-sm/6 text-tg-text-color mb-1">
            <span className="opacity-60">1.</span>{" "}
            <span className="font-semibold opacity-100">Level 1:</span>{" "}
            <span className="opacity-60">
              You receive a bonus for each friend who registers using your
              referral link.
            </span>
          </p>
          <p className="text-sm/6 text-tg-text-color mb-1">
            <span className="opacity-60">2.</span>{" "}
            <span className="font-semibold opacity-100">Level 2:</span>{" "}
            <span className="opacity-60">
              You receive an additional bonus when friends of your referred
              friends also register and start using the program.
            </span>
          </p>
          <p className="text-sm/6 text-tg-text-color">
            <span className="opacity-60">3.</span>{" "}
            <span className="font-semibold opacity-100">Level 3:</span>{" "}
            <span className="opacity-60">
              You receive a bonus when friends of the second level invite new
              participants.
            </span>
          </p>
          <p className="text-sm/6 text-tg-text-color opacity-60 mt-4">
            Thus, you earn rewards not only for your direct invitations but also
            for the activity of all subsequent levels in your network.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default TaskInfoModal;
