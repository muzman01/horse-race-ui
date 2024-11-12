import { useEffect, useState } from "react";

const spriteImages = [
  new URL("../../assets/black-horse/sprite_105.png", import.meta.url).href,
  new URL("../../assets/black-horse/sprite_106.png", import.meta.url).href,
  new URL("../../assets/black-horse/sprite_107.png", import.meta.url).href,
  new URL("../../assets/black-horse/sprite_108.png", import.meta.url).href,
  new URL("../../assets/black-horse/sprite_109.png", import.meta.url).href,
  new URL("../../assets/black-horse/sprite_110.png", import.meta.url).href,
];

const MAX_SCORE = 60; // Maksimum toplam skor

const BlackHorse = ({ diceValue, parentWidth, owner, diceResult }: any) => {
  const [currentSpriteIndex, setCurrentSpriteIndex] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);

  // Birimleri hesapla: parentWidth'i maksimum skora bölerek her bir skor birimi için mesafe ayarlıyoruz.
  const unitWidth = parentWidth / MAX_SCORE;

  // Zar atıldıkça güncelleme

  // Yeni toplam skora göre atın pozisyonunu hesapla
  useEffect(() => {
    setCurrentPosition(diceValue * unitWidth);
  }, [diceValue]);

  // Atın animasyonunu her 100 ms'de bir sprite değiştirerek çalıştır
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSpriteIndex(
        (prevIndex) => (prevIndex + 1) % spriteImages.length
      );
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex  flex-col items-center">
      <div className="absolute top-0 gap-3 justify-between right-0 flex text-white text-xs px-2 py-1 rounded-bl-lg shadow-lg">
        <div className="text-[8px]">
          {owner === "Your Horse!!" ? "" : `Owner: ${owner}`}
        </div>
        <div className="flex justify-between">
          <span className="text-[8px]">
            {" "}
            {owner === "Your Horse!!" ? (
              <>
                <span className="text-yellow-500">Your Dice: {diceResult}</span>
              </>
            ) : (
              <>
                Total Dice:
                {diceResult}
              </>
            )}
          </span>
        </div>
      </div>
      <div
        className="sprite-container"
        style={{
          width: `${parentWidth}px`,
          height: "48px",
          position: "relative",
        }}
      >
        <div
          className="sprite-move"
          style={{ left: `${currentPosition}px`, position: "absolute", top: 0 }} // Pozisyonu dinamik olarak ayarladık
        >
          <img
            src={spriteImages[currentSpriteIndex]}
            alt={`Sprite ${currentSpriteIndex + 105}`}
            style={{ width: "64px", height: "48px" }}
          />
        </div>
      </div>
      <span className="border-b-2 border-[#7B5E57] w-[95%]"></span>
    </div>
  );
};

export default BlackHorse;
