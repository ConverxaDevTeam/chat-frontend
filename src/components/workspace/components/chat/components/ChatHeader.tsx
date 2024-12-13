interface ChatHeaderProps {
  onClose?: () => void;
}

export const ChatHeader = ({ onClose }: ChatHeaderProps) => {
  return (
    <div className="p-4 bg-blue-500 text-white font-semibold flex justify-between items-center">
      <span className="text-left">Chat</span>
      {onClose && (
        <button
          onClick={onClose}
          className="text-white hover:text-gray-300 focus:outline-none"
          aria-label="Cerrar chat"
        >
          ✕
        </button>
      )}
    </div>
  );
};
