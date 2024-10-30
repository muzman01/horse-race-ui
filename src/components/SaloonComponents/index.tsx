import { useSelector } from "react-redux";
import SalonComponent from "./SalonComponent";
import { RootState } from "../../store";

const SaloonComponents = () => {
  const { salons, loading, error } = useSelector(
    (state: RootState) => state.salon
  );

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (error) {
    return <div>Hata: {error}</div>;
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
        {salons.map((salon) => (
          <SalonComponent key={salon.salon_id} salon={salon} />
        ))}
      </div>
    </div>
  );
};

export default SaloonComponents;
