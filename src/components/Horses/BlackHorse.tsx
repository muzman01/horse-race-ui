import { useEffect, useState } from "react";

const spriteImages = [
  new URL("../../assets/black-horse/sprite_105.png", import.meta.url).href,
  new URL("../../assets/black-horse/sprite_106.png", import.meta.url).href,
  new URL("../../assets/black-horse/sprite_107.png", import.meta.url).href,
  new URL("../../assets/black-horse/sprite_108.png", import.meta.url).href,
  new URL("../../assets/black-horse/sprite_109.png", import.meta.url).href,
  new URL("../../assets/black-horse/sprite_110.png", import.meta.url).href,
];

const BlackHorse = () => {
  const [currentSpriteIndex, setCurrentSpriteIndex] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0); // Toplam pozisyon
  const totalParts = 36; // Genişliği 36 parçaya böl
  const partWidth = 100 / totalParts; // Her parçanın genişliği

  const moveSprite = (diceValue: number) => {
    // Zar değerini mevcut pozisyona ekle
    setCurrentPosition((prevPosition) =>
      Math.min(prevPosition + diceValue * partWidth, 100)
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSpriteIndex(
        (prevIndex) => (prevIndex + 1) % spriteImages.length
      );
    }, 100); // Her 100 ms'de bir sprite değişir

    return () => clearInterval(interval); // Cleanup
  }, []);

  return (
    <div className="flex flex-col items-center">
      {" "}
      {/* Ortalamak için ekledik */}
      <div onClick={() => moveSprite(1)} className="sprite-container">
        <div
          className="sprite-move"
          style={{ left: `${currentPosition}%`, position: "relative" }}
        >
          <img
            src={spriteImages[currentSpriteIndex]}
            alt={`Sprite ${currentSpriteIndex + 105}`}
            style={{ width: "64px", height: "48px" }} // Boyutları ayarlayın
          />
        </div>
      </div>
    </div>
  );
};

export default BlackHorse;
