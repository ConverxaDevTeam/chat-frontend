import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@store";

type UserProfileProps = {
  sidebarMinimized: boolean;
  mobileResolution: boolean;
};

const UserProfile: React.FC<UserProfileProps> = ({
  sidebarMinimized,
  mobileResolution,
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);

  const [, setMenuPosition] = useState({ x: 0, y: 0 });

  if (sidebarMinimized || mobileResolution) {
    return (
      <div className="flex justify-center items-center py-3 mb-2">
        <button
          className="w-10 h-10 rounded-full overflow-hidden border-[0.5px] border-sofia-darkBlue bg-[#343E4F] flex items-center justify-center text-white font-medium"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Perfil de usuario"
        >
          <span className="text-lg uppercase">
            {user?.email?.charAt(0) || ""}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#F4FAFF] border border-sofia-darkBlue rounded-[4px] py-3 px-3 mb-5">
      <div className="flex items-center rounded-[4px] p-2 relative">
        <div className="flex items-center w-full">
          <div className="w-10 h-10 rounded-full overflow-hidden border-[0.5px] border-sofia-darkBlue flex-shrink-0 bg-[#343E4F] flex items-center justify-center text-white font-normal">
            <span className="text-lg uppercase">
              {user?.email?.charAt(0) || ""}
            </span>
          </div>

          <div className="flex flex-col mx-3 flex-grow overflow-hidden">
            <span className="text-xs font-medium text-[#343E4F] truncate">
              {user?.email?.split("@")[0] || "Usuario"}
            </span>
            <span className="text-xs text-gray-500 truncate font-normal">
              {user?.email || ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
