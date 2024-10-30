import "@telegram-apps/telegram-ui/dist/styles.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { TelegramProvider } from "./context/TelegramContext";
import { setBackgroundAsSecondary } from "./helpers/setBackgroundAsSecondary";
import { Provider } from "react-redux";
import { store } from "./store";
import { AppRoot } from "@telegram-apps/telegram-ui"; // AppRoot'u import ediyoruz

setBackgroundAsSecondary();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppRoot>
      {" "}
      {/* Uygulamanın en dış katmanına AppRoot bileşenini ekliyoruz */}
      <TelegramProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </TelegramProvider>
    </AppRoot>
  </StrictMode>
);
