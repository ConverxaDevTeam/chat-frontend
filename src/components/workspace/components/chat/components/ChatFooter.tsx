interface ChatFooterProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
}

export const ChatFooter = ({
  inputValue,
  onInputChange,
  onSendMessage,
}: ChatFooterProps) => {
  return (
    <div className="grid grid-cols-[1fr,auto] gap-2 p-4 border-t border-gray-300">
      <input
        type="text"
        value={inputValue}
        onChange={e => onInputChange(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Escribe un mensaje..."
      />
      <button
        onClick={onSendMessage}
        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Enviar
      </button>
    </div>
  );
};
