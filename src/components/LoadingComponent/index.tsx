import { mainLogo } from "../../images"; // Görselin bulunduğu dizinden mainLogo'yu alıyoruz

const LoadingComponent = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-4">
          <img
            src={mainLogo}
            alt="Loading"
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <p className="text-white text-lg font-semibold mb-2">Loading...</p>
        <div className="w-36 h-2 bg-gray-700 rounded-full overflow-hidden relative mx-auto">
          <div className="absolute left-0 top-0 h-full bg-yellow-400 rounded-full animate-loading-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingComponent;
