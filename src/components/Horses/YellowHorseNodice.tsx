import { useEffect, useState } from "react";

const spriteImages = [
  new URL("../../assets/yellow-horse/sprite_105.png", import.meta.url).href,
  new URL("../../assets/yellow-horse/sprite_106.png", import.meta.url).href,
  new URL("../../assets/yellow-horse/sprite_107.png", import.meta.url).href,
  new URL("../../assets/yellow-horse/sprite_108.png", import.meta.url).href,
  new URL("../../assets/yellow-horse/sprite_109.png", import.meta.url).href,
  new URL("../../assets/yellow-horse/sprite_110.png", import.meta.url).href,
];

const YellowHorseNodice = () => {
  const [currentSpriteIndex, setCurrentSpriteIndex] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0); // Atın yatay pozisyonu

  // Atı sürekli soldan sağa hareket ettiren fonksiyon
  useEffect(() => {
    const moveInterval = setInterval(() => {
      setCurrentPosition((prevPosition) => {
        // Pist bittiğinde tekrar başa dön
        return prevPosition >= 100 ? 0 : prevPosition + 0.5; // 0.5 birimle ilerlet
      });
    }, 50); // Her 50ms'de bir pozisyon güncellenir

    return () => clearInterval(moveInterval); // Cleanup
  }, []);

  // Sprite animasyonunu değiştiren mekanizma
  useEffect(() => {
    const spriteInterval = setInterval(() => {
      setCurrentSpriteIndex(
        (prevIndex) => (prevIndex + 1) % spriteImages.length
      );
    }, 100); // Her 100ms'de bir sprite değişir (animasyon)

    return () => clearInterval(spriteInterval); // Cleanup
  }, []);

  return (
    <div className="flex flex-col items-center">
      {/* Atın pistte sürekli soldan sağa hareket etmesi */}
      <div
        className="sprite-container"
        style={{
          width: "100%",
          height: "50px",
        }}
      >
        <div
          className="sprite-move"
          style={{
            left: `${currentPosition}%`,

            transition: "left 0.3s linear", // Yumuşak geçiş
          }}
        >
          <img
            src={spriteImages[currentSpriteIndex]}
            alt={`Sprite ${currentSpriteIndex + 105}`}
            style={{ width: "64px", height: "48px" }} // Sprite boyutu
          />
        </div>
      </div>
    </div>
  );
};

export default YellowHorseNodice;
