import { Link, useLocation } from "react-router-dom";
import { useTelegram } from "../../context/TelegramContext";
import { useEffect } from "react";

const BottomNav = () => {
  const { handleVibrate } = useTelegram();

  const location = useLocation();

  useEffect(() => {
    // Eğer Telegram WebApp API mevcutsa `ready` fonksiyonunu çağır
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
    }
  }, []);
  const isActive = (path: any) => location.pathname === path;

  return (
    <div className="px-7 bg-[#272a2f] py-2 shadow-lg z-[9999] relative bottom-nav-refresh">
      <div className="flex justify-between max-w-3xl mx-auto">
        {" "}
        {/* Ortalamak için max-width ve justify-between */}
        {/* Market */}
        <div
          onClick={handleVibrate}
          className="flex-1 group flex justify-center"
        >
          <Link
            to="/market"
            className={`flex flex-col items-center text-center mx-auto px-4 pt-2 w-full ${
              isActive("/market") ? "text-[#2cb985]" : "text-gray-400"
            } group-hover:text-[#2cb985]`}
          >
            <i
              className={`fas fa-shopping-cart text-2xl ${
                isActive("/market") ? "text-[#2cb985]" : ""
              }`}
            ></i>
            <span className="text-xs">Market</span>
          </Link>
        </div>
        {/* Saloon */}
        <div
          onClick={handleVibrate}
          className="flex-1 group flex justify-center"
        >
          <Link
            to="/saloon"
            className={`flex flex-col items-center text-center mx-auto px-4 pt-2 w-full ${
              isActive("/saloon") ? "text-[#2cb985]" : "text-gray-400"
            } group-hover:text-[#2cb985]`}
          >
            <i
              className={`fas fa-horse-head text-2xl ${
                isActive("/saloon") ? "text-[#2cb985]" : ""
              }`}
            ></i>
            <span className="text-xs">Saloon</span>
          </Link>
        </div>
        {/* Home (Ortada) */}
        <div
          onClick={handleVibrate}
          className="flex-1 group flex justify-center"
        >
          <Link
            to="/"
            className={`flex flex-col items-center text-center mx-auto px-4 pt-2 w-full ${
              isActive("/") ? "text-[#2cb985]" : "text-gray-400"
            } group-hover:text-[#2cb985]`}
          >
            <i
              className={`fas fa-home text-2xl ${
                isActive("/") ? "text-[#2cb985]" : ""
              }`}
            ></i>
            <span className="text-xs">Home</span>
            <span
              className={`block w-5 h-1 mt-1 rounded-full ${
                isActive("/") ? "bg-[#2cb985]" : ""
              }`}
            ></span>
          </Link>
        </div>
        {/* Kupon */}
        <div
          onClick={handleVibrate}
          className="flex-1 group flex justify-center"
        >
          <Link
            to="/coupon"
            className={`flex flex-col items-center text-center mx-auto px-4 pt-2 w-full ${
              isActive("/coupon") ? "text-[#2cb985]" : "text-gray-400"
            } group-hover:text-[#2cb985]`}
          >
            <i
              className={`fas fa-ticket-alt text-2xl ${
                isActive("/coupon") ? "text-[#2cb985]" : ""
              }`}
            ></i>
            <span className="text-xs">Coupon</span>
          </Link>
        </div>
        {/* Tasks */}
        <div
          onClick={handleVibrate}
          className="flex-1 group flex justify-center"
        >
          <Link
            to="/tasks"
            className={`flex flex-col items-center text-center mx-auto px-4 pt-2 w-full ${
              isActive("/tasks") ? "text-[#2cb985]" : "text-gray-400"
            } group-hover:text-[#2cb985]`}
          >
            <i
              className={`fas fa-tasks text-2xl ${
                isActive("/tasks") ? "text-[#2cb985]" : ""
              }`}
            ></i>
            <span className="text-xs">Tasks</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
