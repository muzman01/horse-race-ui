import { IconButton, Modal } from "@telegram-apps/telegram-ui";
import { RxQuestionMarkCircled } from "react-icons/rx";
import { ModalHeader } from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";

const HowToGame = () => {
  return (
    <div className="flex w-full items-end justify-end ">
      <Modal
        header={<ModalHeader> Referral Rewards</ModalHeader>}
        trigger={
          <IconButton mode="outline" size="s">
            <RxQuestionMarkCircled />
          </IconButton>
        }
        className="z-50"
      >
        <div className="mt-2 max-h-[400px] overflow-y-auto">selam</div>
      </Modal>
    </div>
  );
};

export default HowToGame;
