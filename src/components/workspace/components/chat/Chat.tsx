import React from "react";

const Chat = () => {
  return (
    <div className="flex flex-col w-full h-full bg-gray-100 border-r border-gray-300 shadow-lg">
      {/* Encabezado del chat */}
      <div className="p-4 bg-blue-500 text-white font-semibold flex justify-between items-center">
        <span>Chat</span>
      </div>

      {/* Mensajes del chat */}
      <div className="flex-1 p-4 overflow-y-auto">
        <p className="text-gray-600">Bienvenido al chat</p>
        {/* Aquí irían los mensajes dinámicos */}
      </div>

      {/* Campo para escribir */}
      <div className="p-4 border-t border-gray-300 flex items-center">
        <input
          type="text"
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Escribe un mensaje..."
        />
        <button className="ml-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Enviar
        </button>
      </div>
    </div>
  );
};

export default Chat;
