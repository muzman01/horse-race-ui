import { Link } from "react-router-dom";
import Settings from "../../icons/Settings";
import { useTranslation } from "react-i18next"; // i18n kullanımı için import
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const ProfileBar = () => {
  const { t } = useTranslation(); // i18n'den metinleri almak için
  const user_name = useSelector(
    (state: RootState) => state?.user?.user?.username
  );
  const hp_amount =
    useSelector((state: RootState) => state?.user?.user?.hp) || 0;
  return (
    <div className="px-4 z-10 flex flex-row w-full justify-between items-center ">
      <div className="flex items-center gap-1 w-[30%] space-x-2 pt-4">
        <div>
          <p className="text-sm">{user_name} (Jockey) </p> {/* Kullanıcı adı */}
        </div>
      </div>
      <div className="flex items-center w-full gap-1 justify-end space-x-4 mt-3">
        <div className="flex items-center w-2/3 border-2 border-[#43433b] rounded-full px-4 py-[2px] bg-[#43433b]/[0.6] max-w-64">
          <div className="text-[10px] text-center text-[#c25918]">
            {t("HP")} Amount
          </div>{" "}
          {/* Toplam HP */}
          <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
          <div className="flex-1 text-center items-center">
            <div className="text-sm flex items-center justify-center gap-1 text-[#85827d] font-medium">
              {hp_amount}
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
