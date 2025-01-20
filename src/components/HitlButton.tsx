import { FaUserPlus } from "react-icons/fa";

interface HitlButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
  children,
  className,
  ...props
}: HitlButtonProps) => {
  if (currentUserHasConversation) return null;

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={className}
      type="button"
      {...props}
    >
      {children || (
        <>
          <FaUserPlus className="w-4 h-4" />
          {isAssigned ? "Reasignar" : "Asignar"}
        </>
      )}
    </button>
  );
};
