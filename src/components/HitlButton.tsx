import { FaUserPlus } from "react-icons/fa";

interface HitlButtonProps {
  onClick: () => void;
  isLoading: boolean;
  isAssigned: boolean;
  currentUserHasConversation: boolean;
}

export const HitlButton = ({
  onClick,
  isLoading,
  isAssigned,
  currentUserHasConversation,
}: HitlButtonProps) => {
  if (currentUserHasConversation) return null;

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="bg-[#15ECDA] hover:bg-[#0F9D8C] text-black font-bold hover:text-white rounded w-[120px] h-[40px] flex items-center justify-center gap-2"
      type="button"
    >
      <FaUserPlus className="w-4 h-4" />
      {isAssigned ? "Reasignar" : "Asignar"}
    </button>
  );
};
