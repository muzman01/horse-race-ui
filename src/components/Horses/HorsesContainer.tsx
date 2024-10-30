import { useEffect, useState } from "react";

const spriteImagesWhite = [
  new URL("../../assets/white-horse/sprite_105.png", import.meta.url).href,
  new URL("../../assets/white-horse/sprite_106.png", import.meta.url).href,
  new URL("../../assets/white-horse/sprite_107.png", import.meta.url).href,
];

const spriteImagesBlack = [
  new URL("../../assets/black-horse/sprite_105.png", import.meta.url).href,
  new URL("../../assets/black-horse/sprite_106.png", import.meta.url).href,
  new URL("../../assets/black-horse/sprite_107.png", import.meta.url).href,
];

const spriteImagesYellow = [
  new URL("../../assets/yellow-horse/sprite_105.png", import.meta.url).href,
  new URL("../../assets/yellow-horse/sprite_106.png", import.meta.url).href,
  new URL("../../assets/yellow-horse/sprite_107.png", import.meta.url).href,
];

const Horse = ({ spriteImages, startOffset }: any) => {
  const [currentSpriteIndex, setCurrentSpriteIndex] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(startOffset);

  // Atı sürekli soldan sağa hareket ettiren fonksiyon
  useEffect(() => {
    const moveInterval = setInterval(() => {
      setCurrentPosition((prevPosition: any) =>
        prevPosition >= 100 ? 0 : prevPosition + 0.5
      );
    }, 50); // Hareket hızı

    return () => clearInterval(moveInterval);
  }, []);

  // Sprite animasyonunu değiştiren mekanizma
  useEffect(() => {
    const spriteInterval = setInterval(() => {
      setCurrentSpriteIndex(
        (prevIndex) => (prevIndex + 1) % spriteImages.length
      );
    }, 100); // Her 100ms'de bir sprite değişir (animasyon)

    return () => clearInterval(spriteInterval);
  }, [spriteImages]);

  return (
    <div
      className="absolute"
      style={{
        left: `${currentPosition}%`,
        transition: "left 0.05s linear",
        top: "50%",
        transform: "translateY(-50%)",
      }}
    >
      <img
        src={spriteImages[currentSpriteIndex]}
        alt={`Horse sprite`}
        style={{ width: "64px", height: "48px" }}
      />
    </div>
  );
};

const WhiteHorseNoDice = () => (
  <Horse spriteImages={spriteImagesWhite} startOffset={0} />
);
const BlackHorseNoDice = () => (
  <Horse spriteImages={spriteImagesBlack} startOffset={-5} />
);
const YellowHorseNoDice = () => (
  <Horse spriteImages={spriteImagesYellow} startOffset={-10} />
);

const HorsesContainer = () => {
  return (
    <div className="w-full max-w-md mb-6">
      <div className="rounded-lg p-4 gap-2 relative h-16">
        <WhiteHorseNoDice />
        <BlackHorseNoDice />
        <YellowHorseNoDice />
      </div>
    </div>
  );
};

export default HorsesContainer;
