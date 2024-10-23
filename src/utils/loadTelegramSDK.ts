// src/utils/loadTelegramSDK.ts
export const loadTelegramSDK = (): Promise<any> => {
  return new Promise((resolve) => {
    const existingScript = document.getElementById("telegram-sdk");

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-web-app.js";
      script.id = "telegram-sdk";
      script.async = true;
      script.onload = () => {
        console.log("Telegram SDK Loaded");
        resolve(window.Telegram.WebApp);
      };
      document.body.appendChild(script);
    } else {
      resolve(window.Telegram.WebApp);
    }
  });
};
