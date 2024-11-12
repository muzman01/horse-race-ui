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
import { ToastContainer } from "react-toastify";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import "react-toastify/dist/ReactToastify.css";
import "./i18n"; // i18n yapılandırmasını buraya ekleyin
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'react-tooltip/dist/react-tooltip.css'

setBackgroundAsSecondary();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TonConnectUIProvider manifestUrl="https://horse-race-ui.vercel.app/tonconnect-manifest.json">
      <AppRoot>
        {" "}
        {/* Uygulamanın en dış katmanına AppRoot bileşenini ekliyoruz */}
        <TelegramProvider>
          <ToastContainer
            position="top-center"
            autoClose={4999}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
          <Provider store={store}>
            <App />
          </Provider>
        </TelegramProvider>
      </AppRoot>
    </TonConnectUIProvider>
  </StrictMode>
);
