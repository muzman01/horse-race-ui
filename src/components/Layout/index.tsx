// Layout.js
import React from "react";
import BottomNav from "../BottomNav";
import ProfileBar from "../ProfileBar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="bg-black flex justify-center font-fantasy overflow-x-hidden">
      <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl">
        <ProfileBar />
        {/* Ortadaki sarı kısım ve içeriği */}
        <div className="flex-grow mt-4 bg-gradient-to-r from-[#2cb985] via-[#24976c] to-[#1b704f] rounded-t-[48px] relative top-glow z-0 overflow-hidden">
          <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-[#1d2025] rounded-t-[46px] overflow-y-auto overflow-x-hidden">
            {/* Çocuk bileşenler buraya yerleştirilecek */}
            <div className="px-4 mt-4 flex justify-center">
              <div className="w-full max-w-sm px-4 py-2 flex items-center space-x-2">
                {children}
              </div>
            </div>
          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  );
};

export default Layout;
