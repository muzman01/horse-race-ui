import { Link } from "react-router-dom";
import Settings from "../../icons/Settings";

const ProfileBar = () => {
  return (
    <div className="px-4 z-10">
      <div className="flex items-center space-x-2 pt-4" data-aos="fade-right">
        <div>
          <p className="text-sm">test</p>
        </div>
      </div>
      <div
        className="flex items-center justify-between space-x-4 mt-1"
        data-aos="fade-right"
      >
        <div className="flex items-center w-1/3">
          <div className="w-full">
            <div className="flex justify-between">
              <p className="text-sm">
                <span className="text-[#95908a]">ddd</span>
              </p>
            </div>
            <div className="flex items-center mt-1 border-2 border-[#43433b] rounded-full">
              <div className="w-full h-2 bg-[#43433b]/[0.6] rounded-full">
                <div className="progress-gradient h-2 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="flex items-center w-2/3 border-2 border-[#43433b] rounded-full px-4 py-[2px] bg-[#43433b]/[0.6] max-w-64"
          data-aos="fade-left"
        >
          <div className="text-xs">Total Earn</div>
          <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
          <div className="flex-1 text-center items-center">
            <div className="text-sm flex  items-center justify-center gap-1 text-[#85827d] font-medium">
              xx
            </div>
          </div>
          <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
          <Link to="/settings">
            <Settings className="text-white" />
          </Link>
        </div>
      </div>

      {/* TRX fiyatını göstermek için ekleme */}
    </div>
  );
};

export default ProfileBar;
