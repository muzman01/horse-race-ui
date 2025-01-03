import { useSelector } from "react-redux";
import SalonComponent from "./SalonComponent";
import { RootState } from "../../store";
import LoadingComponent from "../LoadingComponent";

const SaloonComponents = () => {
  const { salons, loading, error } = useSelector(
    (state: RootState) => state.salon
  );

  // `salon_id` değeri 0 olan salonları en üste getirmek için sıralama
  const sortedSalons = [
    ...salons.filter((salon) => salon.salon_id === 0),
    ...salons.filter((salon) => salon.salon_id !== 0),
  ];

  if (loading) {
    return <LoadingComponent />;
  }

  if (error && salons.length === 0) {
    // Sadece salons boşken hata mesajını göster
    return <LoadingComponent />;
  }

  return (
    <div className="p-4 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#c25918]"> 🏆 Tournament 🏆</h1>
        <p className="text-gray-300 text-lg font-light italic">
          Choose your favorite room and sit at the tables for big winnings! 💰
        </p>
      </div>

      <div>
        {sortedSalons.map((salon) => (
          <SalonComponent key={salon.salon_id} salon={salon} />
        ))}
      </div>
    </div>
  );
};

export default SaloonComponents;
