import { copyIconWhite, nullUserIcon, tonIcon } from "../../images";

const SettingsComponent = () => {
  return (
    <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] text-white min-h-screen p-4">
      {/* Header */}
      <div className=" bg-[#2b2f36] p-4 rounded-lg  flex items-center justify-between mb-6">
        <div>
          <p className="text-lg">Merhaba,</p>
          <p className="text-2xl font-bold">Muzman</p>
        </div>
        <div className="bg-gray-700 rounded-full p-2">
          <img src={nullUserIcon} className="rounded-full w-12 h-12" />
        </div>
      </div>

      {/* Wallet Button with white lines */}
      <div className="border-t border-b border-gray-700 items-center justify-center pt-4">
        <button className="w-full gap-2 bg-[#2b2f36] text-white py-3 rounded-lg flex items-center justify-center mb-4">
          <div className="bg-gray-700 rounded-full p-1">
            <img src={tonIcon} className="rounded-full w-8 h-8" />
          </div>
          Connect Wallet
        </button>
      </div>

      {/* Options - Box Styles */}
      <div className="space-y-4 mt-4">
        {/* Benim ID */}
        <div className="bg-[#2b2f36] p-4 rounded-lg flex items-center justify-between">
          <p className="text-gray-300">Telegram ID</p>
          <div className="flex items-center space-x-2">
            <button className="p-1 rounded">
              <img src={copyIconWhite} className="" />
            </button>

            <p>5027189956</p>
          </div>
        </div>

        {/* Dil */}
        <div className="bg-[#2b2f36] p-4 rounded-lg flex items-center justify-between">
          <p className="text-gray-300">Language</p>
          <div className="flex items-center space-x-2">
            <p>Türkçe</p>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/b4/Flag_of_Turkey.svg"
              alt="Türk Bayrağı"
              className="w-6 h-4"
            />
          </div>
        </div>

        {/* Arkadaşlarını Davet Et */}
        <div className="bg-[#2b2f36] p-4 rounded-lg flex items-center">
          <p className="text-gray-300">Invate Friend</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsComponent;
