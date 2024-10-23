import { IconProps } from "../utils/types";
import React from "react";

const Home: React.FC<IconProps> = ({ size = 24, className = "" }) => {
  // SVG boyutunu ve sınıf adını ayarlamak için değişkenler
  const svgSize = `${size}px`;

  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={className}
      height={svgSize}
      width={svgSize}
    >
      <path d="M32 12L4 36h8v16h16V40h8v12h16V36h8z" />
      <path
        d="M20 52h-8V36h-6.1L32 14.2 58.1 36H52v16h-8V40h-8v12h-8V40h-8z"
        fill="none"
      />
    </svg>
  );
};

export default Home;
