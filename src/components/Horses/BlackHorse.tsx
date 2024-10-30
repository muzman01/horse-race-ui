import { useEffect, useState } from "react";

const spriteImages = [
  new URL("../../assets/black-horse/sprite_105.png", import.meta.url).href,
  new URL("../../assets/black-horse/sprite_106.png", import.meta.url).href,
  new URL("../../assets/black-horse/sprite_107.png", import.meta.url).href,
  new URL("../../assets/black-horse/sprite_108.png", import.meta.url).href,
  new URL("../../assets/black-horse/sprite_109.png", import.meta.url).href,
  new URL("../../assets/black-horse/sprite_110.png", import.meta.url).href,
];

const BlackHorse = ({ diceValue }: any) => {
  const parentWidth = 320; // Parent genişliği
  const [currentSpriteIndex, setCurrentSpriteIndex] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0); // Başlangıç pozisyonu
  const totalParts = 36; // Alanı 36 parçaya bölüyoruz
  const partWidth = parentWidth / totalParts; // Her parçanın genişliği

  // Zar değeri değiştiğinde atı hareket ettir
  const moveSprite = (diceValue: any) => {
    setCurrentPosition((prevPosition) => {
      const newPosition = prevPosition + diceValue * partWidth;
      return Math.min(newPosition, parentWidth - 64); // At 64px genişliğinde olduğu için sınır koyduk
    });
  };

  useEffect(() => {
    if (diceValue > 0) {
      moveSprite(diceValue);
    }
  }, [diceValue]);

  // Atın animasyonunu her 100ms'de bir sprite değiştirmek için kullanıyoruz
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSpriteIndex(
        (prevIndex) => (prevIndex + 1) % spriteImages.length
      );
    }, 100);

    return () => clearInterval(interval); // Temizleme işlemi
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

export default BlackHorse;
