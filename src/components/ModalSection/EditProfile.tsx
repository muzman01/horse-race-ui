import React, { useState } from "react";
import { Modal } from "@telegram-apps/telegram-ui";
import { ModalHeader } from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";
import { useTelegram } from "../../context/TelegramContext";
import Settings from "../../icons/Settings";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import useToast from "../../hooks/useToast";
import { nullUserIcon } from "../../images";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditProfile = () => {
  const { handleVibrate } = useTelegram();
  const toast = useToast();

  // Redux'tan kullanıcı bilgilerini çekme
  const user = useSelector((state: RootState) => state.user.user);
  const [username, setUsername] = useState(user?.username || "");
  const [profilePicture, setProfilePicture] = useState<string>(
    user?.photo_url || ""
  );

  // Fotoğraf boyutu 2MB ile sınırlandırma ve base64 dönüştürme
  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Photo size must be under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Kaydetme fonksiyonu - API isteği ile güncelleme yapar
  const handleSaveChanges = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/users/${user?.telegram_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username || undefined,
            photo_url: profilePicture || undefined,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Update failed");
      }

      toast.success("Changes saved successfully.");
    } catch (error) {
      toast.error("An error occurred during the update.");
      console.error("Update error:", error);
    }
  };

  return (
    <div>
      <Modal
        header={<ModalHeader>Edit Profile</ModalHeader>}
        trigger={
          <div
            onClick={handleVibrate}
            className="bg-[#2b2f36] rounded-lg flex items-center cursor-pointer p-2"
          >
            <div className="text-gray-300 items-center justify-center flex gap-1">
              Edit <Settings className="text-white w-5 h-5" />
            </div>
          </div>
        }
        className="z-50"
      >
        <div className="p-6 bg-[#1e1e1e] rounded-2xl min-h-[300px] flex flex-col items-center shadow-xl space-y-6 w-full">
          {/* Profil fotoğrafı */}
          <div className="flex flex-col items-center gap-2 mt-4">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#f5a623]">
              <img
                src={profilePicture || nullUserIcon}
                alt="Profile"
                className="w-full h-full object-cover"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                title="Choose a new profile picture"
              />
            </div>
            <p className="text-sm text-gray-400">Change Profile Picture</p>
          </div>

          {/* Kullanıcı adı */}
          <div className="w-full px-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-[#2b2f36] text-white p-2 rounded-lg text-sm w-full text-center"
              placeholder="Enter your username"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveChanges}
            className="bg-[#f5a623] text-white px-6 py-2 rounded-lg mt-4 hover:bg-[#e59a1e] transition-colors"
          >
            Save Changes
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default EditProfile;
