// src/global.d.ts

interface TelegramWebApp {
    initData: string;
    initDataUnsafe: {
      user: {
        id: number;
        first_name: string;
        last_name?: string;
        username?: string;
        language_code?: string;
      };
    };
    ready: () => void;
    close: () => void;
  }
  
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp;
    };
  }
  