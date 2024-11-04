import React, { useState } from "react";
import HorsesContainer from "../Horses/HorsesContainer";

const horseNames = [
  "White Stallion",
  "Black Knight",
  "Golden Charger",
  "Thunder",
  "Lightning",
  "Windrunner",
] as const; // horseNames sabit olacak

// Varsayılan oranlar (her at için tahmini bir oran)
const horseOdds = {
  "White Stallion": 3.0,
  "Black Knight": 2.5,
  "Golden Charger": 4.0,
  Thunder: 3.5,
  Lightning: 2.0,
  Windrunner: 5.0,
} as const;

const CuponComponent = () => {
  const [selectedHorses, setSelectedHorses] = useState<string[]>([]);
  const [betAmount, setBetAmount] = useState<string>(""); // Bahis miktarı (string olarak saklanacak)
  const [totalAmount, setTotalAmount] = useState<number>(0); // Toplam kupon tutarı
  const [estimatedEarnings, setEstimatedEarnings] = useState<number>(0); // Tahmini kazanç

  const handleSelection = (index: number, horse: string) => {
    const updatedSelections = [...selectedHorses];
    updatedSelections[index] = horse;
    setSelectedHorses(updatedSelections);
    calculateEarnings(updatedSelections);
  };

  const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = e.target.value;
    if (!isNaN(Number(amount))) {
      setBetAmount(amount);
      calculateTotal(Number(amount));
      calculateEarnings(selectedHorses); // Bahis miktarı değiştiğinde kazancı yeniden hesapla
    }
  };

  const calculateTotal = (amount: number) => {
    const selectedCount = selectedHorses.filter(Boolean).length; // Seçilen at sayısı
    setTotalAmount(amount * selectedCount); // Bahis miktarı ile seçilen at sayısını çarp
  };

  const calculateEarnings = (selections: string[]) => {
    // Seçimlerde oranı olan atlar için kazançları hesapla
    const validSelections = selections.filter(
      (horse) => horse
    ) as (keyof typeof horseOdds)[];
    const totalOdds = validSelections.reduce((acc, horse) => {
      return acc + (horseOdds[horse] || 0); // Geçerli atın oranını ekle
    }, 0);

    const earnings = totalOdds * Number(betAmount || 0); // Toplam oran * bahis miktarı
    setEstimatedEarnings(earnings); // Kazancı state'e ata
  };

  const isHorseSelected = (horse: string) => {
    return selectedHorses.includes(horse); // Bu at daha önce seçilmiş mi?
  };

  return (
    <div className="p-4 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] min-h-screen flex flex-col items-center justify-start">
      {/* Header */}

      <h1 className="text-3xl font-bold text-[#c25918]"> 🏇 Bet Slip 🏇</h1>

      {/* GIF Area (Below the Header) */}
      <div className="w-full mt-4 max-w-md mb-6">
        <div className="bg-[#5e1f1f] rounded-lg p-4 gap-2 shadow-lg flex items-center justify-center">
          {/* GIFs */}
          <HorsesContainer /> {/* Atların ardı ardına koştuğu container */}
        </div>
      </div>

      {/* Kupon Preview */}
      <div className="w-full max-w-md mb-6 bg-[#303030] rounded-lg p-4 shadow-lg text-white">
        <h2 className="text-2xl font-bold mb-4">Your Bet Preview</h2>
        {selectedHorses.length > 0 ? (
          <ul className="space-y-2">
            {selectedHorses.map((horse, index) => (
              <li key={index} className="flex justify-between">
                <span>{index + 1}.</span>
                <span>{horse || "Not selected"}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 italic">No horses selected yet.</p>
        )}

        {/* Estimated Earnings */}
        <div className="mt-4">
          <h3 className="text-lg font-bold">Estimated Earnings:</h3>
          <p className="text-xl font-extrabold">
            {estimatedEarnings.toFixed(2)} TL
          </p>
        </div>
      </div>

      {/* Bet Slip Area */}
      <div className="w-full text-gray-300 max-w-md bg-[#212121] rounded-lg p-6 shadow-lg space-y-6">
        {/* Horse Selection Radio Buttons */}
        <div className="absolute inset-0 flex items-center justify-center bg-opacity-60 bg-black rounded-lg">
          <span className="text-4xl font-bold text-[#c25918] opacity-70 transform rotate-45">
            Coming Soon
          </span>
        </div>
        {["First", "Second", "Third", "Fourth", "Fifth", "Sixth"].map(
          (label, index) => (
            <div
              key={index}
              className={`flex flex-col space-y-2 p-4 rounded-md ${
                index % 2 === 0 ? "bg-gray-600" : "bg-gray-600 bg-opacity-50"
              }`}
            >
              <label className="text-gray-300 font-semibold">
                Select the {label} Horse:
              </label>
              <div className="flex flex-wrap justify-between gap-2">
                {horseNames.map((horse, idx) => (
                  <label
                    key={idx}
                    className="flex flex-col items-center space-y-1 text-gray-300 min-w-[30%]"
                  >
                    <input
                      type="radio"
                      name={`choice${index}`}
                      value={horse}
                      className="form-radio"
                      onChange={() => handleSelection(index, horse)}
                      disabled={isHorseSelected(horse)} // Eğer at seçildiyse disabled yapıyoruz
                    />
                    <span
                      className={`text-center ${
                        isHorseSelected(horse) ? "text-gray-500" : "text-white"
                      }`}
                    >
                      {horse}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )
        )}

        {/* Bet Amount (Input moved to the bottom) */}
        <div className="flex flex-col space-y-2 p-4 rounded-md bg-gray-600">
          <label className="text-gray-300 font-semibold">Bet Amount (TL)</label>
          <input
            type="text"
            value={betAmount}
            onChange={handleBetAmountChange}
            placeholder="Enter Bet Amount"
            className="p-3 rounded-md bg-gray-700 text-white"
          />
        </div>

        {/* Total Bet Amount */}
        <div className="flex justify-between items-center p-4 bg-gray-700 rounded-md text-white">
          <span className="text-lg font-bold">Total Bet Amount:</span>
          <span className="text-xl font-extrabold">{totalAmount} TL</span>
        </div>

        {/* Add Bet Slip Button */}
        <button className="w-full bg-gradient-to-r from-[#c25918] to-[#c25918] text-white p-4 rounded-md font-bold text-lg hover:shadow-xl hover:from-[#ffa726] hover:to-[#ffb74d] transition duration-200 ease-in-out">
          Add Bet Slip
        </button>
      </div>
    </div>
  );
};

export default CuponComponent;
