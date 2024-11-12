import React, { createContext, useContext, useEffect, useState } from "react";
import { loadTelegramSDK } from "../utils/loadTelegramSDK";

interface TelegramUser {
  telegram_id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
}

interface TelegramContextType {
  telegramUser: TelegramUser | null; // 'null' olabilir
  showBackButton: () => void;
  hideBackButton: () => void;
  handleVibrate: () => void;
}

const TelegramContext = createContext<TelegramContextType | null>(null);

export const useTelegram = () => {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error("useTelegram must be used within a TelegramProvider");
  }
  return context;
};

export const TelegramProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [telegram, setTelegram] = useState<any>(null);
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    loadTelegramSDK().then((tg) => {
      tg.ready();
      setTelegram(tg);

      // Telegram Web App kullanıcı bilgilerini al ve duruma ata
      const user = tg.initDataUnsafe?.user;
      if (user) {
        setTelegramUser({
          telegram_id: user.id,
          first_name: user.first_name || "",
          last_name: user.last_name,
          username: user.username,
          photo_url: user.photo_url,
          language_code: user.language_code,
        });
      }
    });
  }, []);

  const showBackButton = () => {
    if (telegram?.BackButton) {
      telegram.BackButton.show();
      telegram.BackButton.onClick(() => {
        window.history.back();
      });
    }
  };

  const hideBackButton = () => {
    if (telegram?.BackButton) {
      telegram.BackButton.hide();
    }
  };

  const handleVibrate = () => {
    telegram?.HapticFeedback?.impactOccurred("medium");
  };

  return (
    <TelegramContext.Provider
      value={{ telegramUser, showBackButton, hideBackButton, handleVibrate }}
    >
      {children}
    </TelegramContext.Provider>
  );
};
