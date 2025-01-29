interface ChatHeaderProps {
  onClose?: () => void;
}

export const ChatHeader = ({ onClose }: ChatHeaderProps) => {
  return (
    <div className="flex flex-col justify-center items-center w-[335px] h-[89px] px-6 py-4 gap-2 flex-shrink-0 rounded-t-lg bg-sofia-electricOlive">
      <span className="text-left text-sofia-superDark font-quicksand text-xl font-semibold">
        Web Chat
      </span>
      <span className="text-left text-sofia-superDark font-quicksand text-xs font-normal">
        Prueba la funcionalidad de tu Web Chat
      </span>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 focus:outline-none"
          aria-label="Cerrar chat"
        >
          <img src="/mvp/arrow-right.svg" alt="Menu" className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};
