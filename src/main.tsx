import "@telegram-apps/telegram-ui/dist/styles.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { TelegramProvider } from "./context/TelegramContext";
import { setBackgroundAsSecondary } from "./helpers/setBackgroundAsSecondary";

setBackgroundAsSecondary();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TelegramProvider>
      <App />
    </TelegramProvider>
  </StrictMode>
);
