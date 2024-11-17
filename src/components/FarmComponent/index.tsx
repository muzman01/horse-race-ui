import { useState } from "react";
import RoiCalculator from "../ModalSection/RoiCalculator";

const FarmComponent = () => {
  const [stakedAmount, setStakedAmount] = useState<number>(0); // Stake edilen miktar
  const [inputValue, setInputValue] = useState<string>(""); // Kullanıcı input'u
  const [isExpanded, setIsExpanded] = useState<boolean>(false); // Kart genişletme durumu

  const handleStake = () => {
    if (parseFloat(inputValue) > 0) {
      setStakedAmount(stakedAmount + parseFloat(inputValue));
      setInputValue(""); // Input'u temizle
    }
  };

  const toggleDetails = () => {
    setIsExpanded((prev) => !prev); // Genişletme durumunu değiştir
  };

  return (
    <div className="text-white p-6 w-full max-w-lg mx-auto flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-[#c25918] text-center">
        HP Farming
      </h1>

      {/* Pool Kartı */}
      <div className="bg-[#1e1e1e] p-6 rounded-lg shadow-lg border border-[#2b2f36] transition-all duration-300">
        {/* Üst Alan */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#c25918]">Earn $HP</h2>
            <p className="text-sm text-gray-400">Stake $HP</p>
          </div>
          <div className="w-10 h-10 bg-[#2cb985] flex items-center justify-center rounded-full">
            <i className="fas fa-seedling text-white"></i>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#2b2f36] my-4"></div>

        {/* Orta Alan */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-400">APR</p>
              <RoiCalculator />
            </div>
            <p className="text-lg font-bold text-[#2cb985]">120%</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">$HP Earned</p>
            <p className="text-lg font-bold text-[#c25918]">
              {stakedAmount} $HP
            </p>
            <p className="text-sm text-gray-500">$0 USD</p>
          </div>
        </div>

        {/* Harvest Butonu */}
        <button
          disabled
          className="w-full bg-[#2b2f36] text-gray-500 font-semibold py-2 rounded-lg cursor-not-allowed mb-6"
        >
          Harvest
        </button>

        {/* Enable Butonu */}
        <button
          onClick={handleStake}
          className="w-full bg-[#c25918] text-white font-bold py-2 rounded-lg hover:bg-[#ba6835] transition mb-6"
        >
          Enable
        </button>

        {/* Alt Alan */}
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <i className="fas fa-sync-alt text-[#c25918]"></i>
            <p className="text-[#c25918]">Manual</p>
          </div>
          <button
            onClick={toggleDetails}
            className="text-[#c25918] hover:underline"
          >
            {isExpanded ? "Hide Details" : "Details"}
          </button>
        </div>

        {/* Detaylar */}
        {isExpanded && (
          <div className="mt-4 p-4 bg-[#2b2f36] rounded-lg text-sm text-gray-400">
            <div className="flex justify-between mb-4">
              <p>APR:</p>
              <span className="text-[#2cb985] font-bold">120%</span>
            </div>
            <div className="flex justify-between mb-4">
              <p>Total Staked:</p>
              <span className="text-white font-bold">706,982 HP</span>
            </div>
            <div className="flex justify-between mb-4">
              <p>Ends in:</p>
              <span className="text-white font-bold flex items-center">
                55 days <i className="fas fa-clock ml-2"></i>
              </span>
            </div>

            {/* Linkler */}
            <div className="space-y-2 text-right">
              <a
                href="#"
                className=" text-[#2cb985] hover:underline flex items-center justify-end"
              >
                See Token Info <i className="fas fa-external-link-alt ml-2"></i>
              </a>

              <a
                href="#"
                className=" text-[#2cb985] hover:underline flex items-center justify-end"
              >
                View Contract <i className="fas fa-external-link-alt ml-2"></i>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Neden Stake Edilmeli? */}
      <div className="bg-[#1e1e1e] p-6 rounded-lg shadow-lg mt-8">
        <h2 className="text-2xl font-bold text-[#c25918] text-center mb-6">
          Why Stake HP Tokens?
        </h2>
        <div className="grid grid-cols-1 gap-6">
          {/* Bileşik Faiz */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#2cb985] flex items-center justify-center rounded-full aspect-square">
              <i className="fas fa-piggy-bank text-white text-2xl"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#c25918]">
                Compound Interest
              </h3>
              <p className="text-sm text-gray-400">
                Stake your HP tokens and earn rewards with compound interest.
                The longer you stake, the more rewards you earn!
              </p>
            </div>
          </div>

          {/* İtibar Puanı */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#9b59b6] flex items-center justify-center rounded-full aspect-square">
              <i className="fas fa-trophy text-white text-2xl "></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#c25918]">
                Reputation Points
              </h3>
              <p className="text-sm text-gray-400">
                Earn reputation points for staking. The longer you stay in the
                pool, the better your chances to participate in live races and
                get closer to the grand prize!
              </p>
            </div>
          </div>

          {/* Ekosisteme Katkı */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#c25918] flex items-center justify-center rounded-full aspect-square">
              <i className="fas fa-leaf text-white text-2xl"></i>
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#c25918]">
                Support the Ecosystem
              </h3>
              <p className="text-sm text-gray-400">
                Help grow the HP ecosystem by staking your tokens. A stronger
                ecosystem means better rewards and more features for everyone!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmComponent;
