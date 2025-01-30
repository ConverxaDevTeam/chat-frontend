import { RefObject } from "react";
import { FaEdit } from "react-icons/fa";

interface TitleDisplayProps {
  titleRef: RefObject<HTMLDivElement>;
  title: string;
  onStartEdit: () => void;
  handleInteraction: (e: React.MouseEvent | React.TouchEvent) => void;
}

export const TitleDisplay = ({
  titleRef,
  title,
  onStartEdit,
  handleInteraction,
}: TitleDisplayProps) => (
  <div
    ref={titleRef}
    onClick={onStartEdit}
    onMouseDown={handleInteraction}
    className="flex items-start gap-2 p-2 -m-2 rounded hover:bg-white/50 cursor-pointer group select-none"
  >
    <span className="text-[#001126] text-base font-semibold group-hover:text-[#001126]/80 line-clamp-2">
      {title}
    </span>
    <FaEdit className="text-gray-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
  </div>
);
