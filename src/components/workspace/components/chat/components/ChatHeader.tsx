interface ChatHeaderProps {
  onClose?: () => void;
}

export const ChatHeader = ({ onClose }: ChatHeaderProps) => {
  return (
    <div className="flex flex-col justify-center items-start w-full h-[89px] px-6 py-4 gap-2 flex-shrink-0 rounded-t-lg bg-app-darkBlue">
      <span className="text-left text-app-superDark text-xl font-normal">
        Web chat
      </span>
      <span className="text-left text-app-superDark text-xs font-normal">
        Prueba la funcionalidad de tu Web Chat
      </span>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-900 hover:text-gray-600 focus:outline-none"
          aria-label="Cerrar chat"
        >
          <img src="/mvp/chevron-right.svg" alt="Menu" className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};
