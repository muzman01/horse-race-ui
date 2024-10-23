// src/context/TelegramContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { loadTelegramSDK } from "../utils/loadTelegramSDK";

const TelegramContext = createContext<any>(null);

export const useTelegram = () => useContext(TelegramContext);

export const TelegramProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [telegram, setTelegram] = useState<any>(null);

  useEffect(() => {
    loadTelegramSDK().then((tg) => {
      tg.ready();
      setTelegram(tg);
    });
  }, []);

  const showBackButton = () => {
    if (telegram?.BackButton) {
      telegram.BackButton.show();
      telegram.BackButton.onClick(() => {
        window.history.back(); // Geri gitmek için history.back kullanılır
      });
    }
  };

  const hideBackButton = () => {
    if (telegram?.BackButton) {
      telegram.BackButton.hide();
    }
  };

  const handleVibrate = () => {
    telegram?.HapticFeedback?.impactOccurred("medium"); // Titreşim işlevi
  };

  return (
    <TelegramContext.Provider
      value={{ showBackButton, hideBackButton, handleVibrate }}
    >
      {children}
    </TelegramContext.Provider>
  );
};
