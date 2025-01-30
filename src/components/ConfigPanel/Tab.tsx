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
    className={`w-full px-4 py-3 text-left flex items-center gap-2 font-quicksand text-base text-sofia-superDark ${
      isActive
        ? "h-[35px] flex-shrink-0 bg-sofia-electricGreen font-semibold"
        : "font-normal hover:bg-sofia-electricGreen-100"
    }`}
  >
    {icon}
    {label}
  </button>
);

export default Tab;
