import { FC, ReactNode } from "react";

interface TabProps {
  id: string;
  label: string;
  icon?: ReactNode;
  isActive: boolean;
  onClick: (id: string) => void;
}

const Tab: FC<TabProps> = ({ id, label, icon, isActive, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`w-full pl-4 pr-2 py-3 text-left flex items-center gap-2 text-base rounded-[4px] mb-2 ${
      isActive
        ? "h-[35px] flex-shrink-0 bg-app-superDark font-normal text-white"
        : "h-[35px] font-normal hover:bg-app-electricGreen-100 text-app-superDark"
    }`}
  >
    <span className={isActive ? "text-white filter brightness-0 invert" : ""}>
      {icon}
    </span>
    {label}
  </button>
);

export default Tab;
