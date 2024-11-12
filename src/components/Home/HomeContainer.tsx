import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import AOS from "aos";
import "aos/dist/aos.css";
import { dollarIcon, mainLogo } from "../../images";
import { updateClickScore } from "../../store/slices/userSlice";
import BoostComponent from "./BoostComponent";
import { useTranslation } from "react-i18next";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useTelegram } from "../../context/TelegramContext";
import HowToGame from "../ModalSection/HowToGame";
import Leaderboard from "./Leaderboard";

interface HomeContainerProps {
  sendMessage: (message: any) => void;
}

const HomeContainer: React.FC<HomeContainerProps> = ({ sendMessage }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { handleVibrate } = useTelegram();

  const click_score =
    useSelector((state: RootState) => state?.user?.user?.click_score) || 0;
  const base_click_power =
    useSelector((state: RootState) => state?.user?.user?.click_power) || 1;

  const telegram_id = useSelector(
    (state: RootState) => state?.user?.user?.telegram_id
  );

  const boosts: any = useSelector(
    (state: RootState) => state?.user?.user?.boost
  );

  // Boost süresini kontrol ederek click_power artırımı uygula
  const getAdjustedClickPower = () => {
    if (boosts) {
      const currentTime = Math.floor(Date.now() / 1000);
      const boostEndTime = boosts.start_time + boosts.duration_days * 86400;
      if (currentTime < boostEndTime) {
        switch (boosts.level) {
          case 1:
            return base_click_power + 2;
          case 2:
            return base_click_power + 10;
          case 3:
            return base_click_power + 20;
          default:
            return base_click_power;
        }
      }
    }
    return base_click_power;
  };

  const click_power = getAdjustedClickPower();

  // Reputation puanlarının hesaplanması


  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>(
    []
  );

  useEffect(() => {
    AOS.init();
  }, []);

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    handleVibrate();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `perspective(1000px) rotateX(${
      -y / 10
    }deg) rotateY(${x / 10}deg)`;
    setTimeout(() => {
      card.style.transform = "";
    }, 100);

    dispatch(updateClickScore(click_power));
    setClicks([...clicks, { id: Date.now(), x: e.pageX, y: e.pageY }]);

    sendMessage({
      action: "click",
      click_power: click_power,
      telegram_id: telegram_id,
    });
  };

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter((click) => click.id !== id));
  };


  return (
    <div  className="w-full">
      <div className="px-4 mt-4 flex justify-center">
        <div className="px-4 py-2 flex items-center space-x-2">
          <img src={dollarIcon} alt={t("dollar_icon")} className="w-12 h-12" />
          <p className="text-4xl text-white">{click_score.toLocaleString()}</p>
        </div>
      </div>

      <div data-aos="zoom-in" className="px-4 mt-4 flex justify-center">
        <div
          className="w-40 h-40 p-4 rounded-full circle-outer"
          onClick={handleCardClick}
        >
          <div className="w-full h-full rounded-full circle-inner">
            <img
              src={mainLogo}
              alt={t("main_character")}
              className="w-full h-full rounded-full"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-2">
        <div className="flex w-full gap-1 items-center">
          <span className="text-[15px]">{t("level")}</span>
          <span className="text-[15px] font-semibold">
            {boosts ? boosts.level : 0}
          </span>
        </div>
        <div>
          <HowToGame />
        </div>
        <div className="flex w-full items-end justify-end">
          <BoostComponent />
        </div>
      </div>

      {/* Envanter Alanı */}
      <Leaderboard />
      {clicks.map((click) => (
        <div
          key={click.id}
          className="absolute text-4xl font-bold opacity-0 text-white pointer-events-none"
          style={{
            top: `${click.y - 32}px`,
            left: `${click.x - 20}px`,
            animation: `float 1s ease-out`,
          }}
          onAnimationEnd={() => handleAnimationEnd(click.id)}
        >
          {click_power}
        </div>
      ))}
    </div>
  );
};

export default HomeContainer;
