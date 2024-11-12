import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SaddleModal from "../ModalSection/SaddleModal";
import { saddleIcon, greenSaddleIcon } from "../../images";
import MarketItemModal2 from "../ModalSection/MarketItemModal2";
import MarketItemModal from "../ModalSection/MarketItemModal";
import SaddleModal2 from "../ModalSection/SaddleModal2";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import BuyMarketModal from "../ModalSection/BuyMarketModal";
import MarketItemModalCustomHp from "../ModalSection/MarketItemModalCustomHp";
import MarketItemModal2CustomTon from "../ModalSection/MarketItemModal2CustomTon";
import { useTelegram } from "../../context/TelegramContext";

const MarketComponent = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("market");
  const [sortOption, setSortOption] = useState("none");
  const [sortedMarketItems, setSortedMarketItems] = useState<any[]>([]);
  const { handleVibrate } = useTelegram();
  const telegram_id: any = useSelector(
    (state: RootState) => state?.user?.user?.telegram_id
  );
  const market_items =
    useSelector((state: RootState) => state?.market?.market) || [];

  const handleTabClick = (tab: string) => {
    handleVibrate();
    setActiveTab(tab);
    setSortOption("none"); // Tab değişince sıralama sıfırlanır
  };

  // sortOption veya market_items değiştiğinde listeyi sırala
  useEffect(() => {
    let items = [...market_items];

    if (sortOption === "your") {
      // Sadece kullanıcının öğelerini filtrele
      items = items.filter(
        (item) => Number(item.seller) === Number(telegram_id)
      );
    } else {
      // Sıralama işlemini uygula
      items.sort((a, b) => {
        if (sortOption === "price") {
          return b.price - a.price;
        } else if (sortOption === "reputation") {
          return b.reputation_points - a.reputation_points;
        }
        return 0;
      });
    }

    setSortedMarketItems(items);
  }, [sortOption, market_items, telegram_id]);

  const gamePasses = [
    {
      id: 1,
      name: t("game_pass_1"),
      price: "100 HP",
      component: <MarketItemModal title={t("game_pass_1")} price={100} />,
    },
    {
      id: 2,
      name: "Game Pass Custom HP",
      price: "100 HP",
      component: (
        <MarketItemModalCustomHp title={t("game_pass_1")} price={100} />
      ),
    },
    {
      id: 3,
      name: t("game_pass_1"),
      price: "5 TON",
      component: <MarketItemModal2 title={t("game_pass_1")} price={5} />,
    },
    {
      id: 4,
      name: "Game Pass Custom TON",
      price: "5 TON",
      component: (
        <MarketItemModal2CustomTon title={t("game_pass_1")} price={5} />
      ),
    },

    {
      id: 5,
      name: t("game_pass_3"),
      price: "300 HP",
      component: "coming soon",
    },
    {
      id: 6,
      name: t("game_pass_4"),
      price: "400 HP",
      component: "coming soon",
    },
  ];

  const saddleItems = [
    {
      id: 1,
      name: "Saddle",
      price: "200 HP",
      component: <SaddleModal title="Saddle" />,
      img: <img src={saddleIcon} alt="saddle" className="w-10 h-10 mr-4" />,
    },
    {
      id: 2,
      name: "Green Saddle",
      price: "5 TON",
      component: <SaddleModal2 title="Green Saddle" />,
      img: (
        <img src={greenSaddleIcon} alt="saddle" className="w-10 h-10 mr-4" />
      ),
    },
  ];

  return (
    <div className="text-white p-6 w-full max-w-lg mx-auto flex flex-col items-center gap-4">
      {/* Başlık */}
      <h1 className="text-3xl font-bold text-[#c25918]">{t("market")}</h1>

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
          {t("market")}
        </button>
        <button
          onClick={() => handleTabClick("saddle")}
          className={`px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
            activeTab === "saddle"
              ? "text-white border-b-4 border-[#c25918]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          {t("saddle")}
        </button>
        <button
          onClick={() => handleTabClick("marketplace")}
          className={`px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
            activeTab === "marketplace"
              ? "text-white border-b-4 border-[#c25918]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          {t("marketplace")}
        </button>
      </div>

      {/* İçerik */}
      {activeTab === "market" && (
        <div className="w-full bg-[#1e1e1e] p-4 rounded-b-lg flex flex-col gap-4">
          <h2 className="text-lg font-bold">{t("available_game_passes")}</h2>
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
                {pass.component === "coming soon" ? (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex justify-center items-center">
                    <p className="text-lg font-bold text-white">
                      {t("coming_soon")}
                    </p>
                  </div>
                ) : (
                  pass.component
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "marketplace" && (
        <div className="w-full bg-[#1e1e1e] p-4 rounded-b-lg flex flex-col gap-4">
          <h2 className="text-lg font-bold">{t("available_marketplace")}</h2>

          {/* Sıralama Seçenekleri */}
          <div className="flex justify-around w-full bg-[#2b2f36] p-2 rounded-lg">
            <button
              onClick={() => setSortOption("price")}
              className={`px-4 py-1 text-sm font-semibold ${
                sortOption === "price"
                  ? "text-white border-b-2 border-[#c25918]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {t("sort_by_price")}
            </button>
            <button
              onClick={() => setSortOption("reputation")}
              className={`px-4 py-1 text-sm font-semibold ${
                sortOption === "reputation"
                  ? "text-white border-b-2 border-[#c25918]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {t("sort_by_reputation")}
            </button>
            <button
              onClick={() => setSortOption("your")}
              className={`px-4 py-1 text-sm font-semibold ${
                sortOption === "your"
                  ? "text-white border-b-2 border-[#c25918]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Your Items
            </button>
          </div>

          {/* Marketplace Ürünleri */}
          <div className="grid grid-cols-1 gap-4">
            {sortedMarketItems.map((item: any, key: any) => (
              <div
                key={key}
                className="relative flex items-center bg-[#2b2f36] p-2 rounded-lg"
              >
                <img
                  src={
                    item.item_slug === "saddleIcon"
                      ? saddleIcon
                      : greenSaddleIcon
                  }
                  alt={item.item_slug}
                  className="w-10 h-10 mr-4"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">
                    {item.item_name}
                  </p>
                  <p className="text-xs text-gray-400">{item.price} TON</p>
                  <p className="text-xs text-gray-400">
                    {item.reputation_points} RP
                  </p>
                </div>
                <BuyMarketModal
                  id={item.id}
                  item_name={item.item_name}
                  item_slug={item.item_slug}
                  price={item.price}
                  reputation_points={item.reputation_points}
                  key={key}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {activeTab === "saddle" && (
        <div className="w-full bg-[#1e1e1e] p-4 rounded-b-lg flex flex-col gap-4">
          <h2 className="text-lg font-bold">{t("available_saddles")}</h2>
          <div className="grid grid-cols-1 gap-4">
            {saddleItems.map((saddle) => (
              <div
                key={saddle.id}
                className="relative flex items-center bg-[#2b2f36] p-4 rounded-lg"
              >
                {/* Saddle Icon */}
                {saddle.img}
                {/* Saddle Detayları */}
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">
                    {saddle.name}
                  </p>
                  <p className="text-xs text-gray-400">{saddle.price}</p>
                </div>

                {/* Satın Alma Butonu */}
                {saddle.component}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketComponent;
