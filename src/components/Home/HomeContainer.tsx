import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../store"; // Redux store türünü import et
import AOS from "aos";
import "aos/dist/aos.css";
import Coins from "../../icons/Coins";
import { BiRocket } from "react-icons/bi";
import { dollarIcon, mainLogo } from "../../images";
import { updateClickScore } from "../../store/slices/userSlice";
import { Rocket } from "react-ionicons";
import { Button, Modal, Placeholder } from "@telegram-apps/telegram-ui";
import { ModalHeader } from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";
import BoostComponent from "./BoostComponent";

interface HomeContainerProps {
  sendMessage: (message: any) => void; // WebSocket mesaj gönderme fonksiyonu prop olarak alınıyor
}

const HomeContainer: React.FC<HomeContainerProps> = ({ sendMessage }) => {
  const dispatch = useDispatch();

  // Redux'tan click_score ve click_power değerlerini alıyoruz
  const click_score =
    useSelector((state: RootState) => state?.user?.user?.click_score) || 0;
  const click_power =
    useSelector((state: RootState) => state?.user?.user?.click_power) || 1; // Varsayılan olarak 1 kullan
  const telegram_id = useSelector(
    (state: RootState) => state?.user?.user?.telegram_id
  );
  const [convertAmount, setConvertAmount] = useState<string>("");

  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>(
    []
  );

  useEffect(() => {
    AOS.init();
  }, []);

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `perspective(1000px) rotateX(${
      -y / 10
    }deg) rotateY(${x / 10}deg)`;
    setTimeout(() => {
      card.style.transform = "";
    }, 100);

    // Redux'ta click_score'u güncelle
    dispatch(updateClickScore(click_power)); // Her click'te click_power kadar puan ekle
    setClicks([...clicks, { id: Date.now(), x: e.pageX, y: e.pageY }]);

    // WebSocket üzerinden sunucuya mesaj gönder
    sendMessage({
      action: "click",
      click_power: click_power, // Redux'tan alınan click_power ile mesaj gönder
      telegram_id: telegram_id, // Redux'tan alınan telegram_id'yi ekleyin
    });
  };

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter((click) => click.id !== id));
  };
  const handleConvertClick = () => {
    if (Number(convertAmount) > 0 && Number(convertAmount) <= click_score) {
      setConvertAmount(""); // Dönüştürme sonrası input temizleniyor
    }
  };

  return (
    <div data-aos="zoom-in" className="w-full">
      <div className="px-4 mt-4 flex justify-center">
        <div className="px-4 py-2 flex items-center space-x-2">
          <img src={dollarIcon} alt="Dollar Coin" className="w-12 h-12" />
          <p className="text-4xl text-white">
            {click_score.toLocaleString()}
          </p>{" "}
          {/* Redux'tan gelen click_score'u göster */}
        </div>
      </div>

      <div className="px-4 mt-4 flex justify-center">
        <div
          className="w-80 h-80 p-4 rounded-full circle-outer"
          onClick={handleCardClick}
        >
          <div className="w-full h-full rounded-full circle-inner">
            <img
              src={mainLogo}
              alt="Main Character"
              className="w-full h-full rounded-full"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-2">
        <div className="flex w-full gap-1 items-center ">
          <span className="text-[15px]">Level</span>
          <span className="text-[15px] font-semibold">0</span>
        </div>
        <div className="flex w-full items-end justify-end ">
          <BoostComponent />
        </div>
      </div>
      {/* Convert Alanı */}
      <div className="flex justify-center w-full opacity-80 mt-12">
        <div className="flex flex-col items-center  border-[0.3px] border-[#c25918] rounded-lg w-full p-4 bg-[#2b2f36] backdrop-blur-md">
          <input
            type="number"
            placeholder="Amount to HP"
            className="flex-1 w-full text-center opacity-65 bg-transparent text-white outline-none placeholder-[#c25918]/80 text-sm mb-2 border-b border-[#f5a623]"
            value={convertAmount}
            onChange={(e) => setConvertAmount(e.target.value)}
          />
          <div className="text-white text-sm mb-2">
            HP Amount:{" "}
            <span className="font-semibold">
              {Number(convertAmount) * 10 || 0}
            </span>{" "}
            {/* 1 puan = 10 HP */}
          </div>
          <button
            className="bg-[#c25918]/70 text-white px-6 py-2 rounded-lg hover:bg-[#c25918]/90 transition-all"
            onClick={handleConvertClick}
            disabled={
              Number(convertAmount) <= 0 || Number(convertAmount) > click_score
            }
          >
            Convert
          </button>
        </div>
      </div>
      {clicks.map((click) => (
        <div
          key={click.id}
          className="absolute text-5xl font-bold opacity-0 text-white pointer-events-none"
          style={{
            top: `${click.y - 42}px`,
            left: `${click.x - 28}px`,
            animation: `float 1s ease-out`,
          }}
          onAnimationEnd={() => handleAnimationEnd(click.id)}
        >
          {click_power} {/* Redux'tan gelen click_power'ı göster */}
        </div>
      ))}
    </div>
  );
};

export default HomeContainer;
