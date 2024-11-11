import { useEffect, useState } from "react";

const spriteImages = [
  new URL("../../assets/red-horse/sprite_105.png", import.meta.url).href,
  new URL("../../assets/red-horse/sprite_106.png", import.meta.url).href,
  new URL("../../assets/red-horse/sprite_107.png", import.meta.url).href,
  new URL("../../assets/red-horse/sprite_108.png", import.meta.url).href,
  new URL("../../assets/red-horse/sprite_109.png", import.meta.url).href,
  new URL("../../assets/red-horse/sprite_110.png", import.meta.url).href,
];
const MAX_SCORE = 60; // Maksimum toplam skor

const RedHorse = ({ diceValue, parentWidth }: any) => {
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
    <div className="flex flex-col items-center">
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
            style={{ width: "64px", height: "48px" }} // Sprite boyutları
          />
        </div>
      </div>
    </div>
  );
};

export default RedHorse;
