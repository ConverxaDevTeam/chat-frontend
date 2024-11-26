interface ChatProps {
  onClose?: () => void; // Prop opcional para cerrar el chat
}

const Chat = ({ onClose }: ChatProps) => {
  return (
    <div className="grid grid-rows-[auto,1fr,auto] w-full h-full bg-gray-100 border-r border-gray-300 shadow-lg">
      {/* Encabezado del chat */}
      <div className="p-4 bg-blue-500 text-white font-semibold justify-between items-center">
        <span>Chat</span>
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

      {/* Mensajes del chat */}
      <div className="p-4 overflow-y-auto">
        <p className="text-gray-600">Bienvenido al chat</p>
        {/* Aquí irían los mensajes dinámicos */}
      </div>

      {/* Campo para escribir */}
      <div className="grid grid-cols-[1fr,auto] gap-2 p-4 border-t border-gray-300">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Escribe un mensaje..."
        />
        <button className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Enviar
        </button>
      </div>
    </div>
  );
};

export default Chat;
