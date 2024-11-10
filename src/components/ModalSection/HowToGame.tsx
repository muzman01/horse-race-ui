// components/HowToGame.tsx
import { IconButton, Modal } from "@telegram-apps/telegram-ui";
import { RxQuestionMarkCircled } from "react-icons/rx";
import { ModalHeader } from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";

import { mainLogo } from "../../images";
import StepContent from "../HowToGame";

const HowToGame = () => {
  return (
    <div className="flex w-full items-end justify-end">
      <Modal
        header={<ModalHeader>How to Play</ModalHeader>}
        trigger={
          <IconButton mode="outline" size="s">
            <RxQuestionMarkCircled />
          </IconButton>
        }
        className="z-50 max-w-md h-[90vh] w-full max-h-[600px]" // Modal yüksekliğini ayarladık
      >
        <div className="p-8 bg-[#1e1e1e] rounded-2xl min-h-[500px] flex flex-col items-center justify-between">
          <StepContent
            title="Step 1: Game Overview"
            description="Learn the basics of the game, including objectives and key rules to get started."
            imageSrc={mainLogo}
          />
          <StepContent
            title="Step 2: Setting Up"
            description="Choose your character, customize your settings, and prepare for the game."
          />
          <StepContent
            title="Step 3: Gameplay Mechanics"
            description="Understand the mechanics of the game, including scoring and strategies."
            imageSrc={mainLogo}
          />
          <StepContent
            title="Step 4: Winning the Game"
            description="Learn how to win and earn rewards for your achievements!"
          />
          {/* Diğer adımları ekleyebilirsiniz */}
        </div>
      </Modal>
    </div>
  );
};

export default HowToGame;
