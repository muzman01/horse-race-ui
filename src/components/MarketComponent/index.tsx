import React, { useState } from "react";
import MarketItemModal from "../ModalSection/MarketItemModal"; // Modal bileşenini import ettik
import Fligran from "../ComingSoon/Fligran"; // Fligran bileşeni "coming soon" için kullanılacak
import MarketItemModal2 from "../ModalSection/MarketItemModal2";

const MarketComponent = () => {
  const [activeTab, setActiveTab] = useState("market");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  // Farklı bileşenler için Game Pass verisi
  const gamePasses = [
    {
      id: 1,
      name: "Game Pass 1",
      price: "100 HP",
      component: <MarketItemModal title="Game Pass 1" />,
    },
    {
      id: 2,
      name: "Game Pass 2",
      price: "200 HP",
      component: <MarketItemModal2 title="Game Pass 2" />,
    },
    {
      id: 3,
      name: "Game Pass 3",
      price: "300 HP",
      component: "coming soon",
    },
    {
      id: 4,
      name: "Game Pass 4",
      price: "400 HP",
      component: "coming soon",
    },
  ];

  return (
    <div className="text-white p-6 w-full max-w-lg mx-auto flex flex-col items-center gap-4">
      {/* Market başlığı */}
      <h1 className="text-3xl font-bold text-[#c25918]">Market</h1>

      {/* Tab Navigation */}
      <div className="flex justify-around w-full bg-[#2b2f36] p-4 rounded-t-lg">
        <button
          onClick={() => handleTabClick("market")}
          className={`px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
            activeTab === "market"
              ? "text-white border-b-4 border-[#c25918]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Market
        </button>
        <button
          className="px-4 py-2 text-sm text-gray-500 cursor-not-allowed"
          disabled
        >
          Skin
        </button>
        <button
          className="px-4 py-2 text-sm text-gray-500 cursor-not-allowed"
          disabled
        >
          Horse
        </button>
      </div>

      {/* Market içerik kısmı */}
      {activeTab === "market" && (
        <div className="w-full bg-[#1e1e1e] p-4 rounded-b-lg flex flex-col gap-4">
          <h2 className="text-lg font-bold">Available Game Passes</h2>
          <div className="grid grid-cols-1 gap-4">
            {gamePasses.map((pass) => (
              <div
                key={pass.id}
                className="relative flex justify-between items-center bg-[#2b2f36] p-4 rounded-lg"
              >
                <div>
                  <p className="text-sm font-semibold text-white">
                    {pass.name}
                  </p>
                  <p className="text-xs text-gray-400">{pass.price}</p>
                </div>

                {/* Modal tetikleyici buton ya da Coming Soon kaplaması */}
                {pass.component === "coming soon" ? (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex justify-center items-center">
                    <p className="text-lg font-bold text-white">Coming Soon</p>
                  </div>
                ) : (
                  pass.component
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketComponent;
