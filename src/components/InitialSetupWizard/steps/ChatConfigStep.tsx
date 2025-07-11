import React from "react";
import { StepComponentProps } from "../types";
import StepContainer from "../components/StepContainer";

const ChatConfigStep: React.FC<StepComponentProps> = ({ data, updateData }) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    updateData("chatConfig", { [name]: value });
  };

  return (
    <StepContainer
      title="Configuración del chat"
      subtitle="Personaliza los textos y mensajes que verán tus usuarios"
    >
      <div className="space-y-6">
        <div className="space-y-4">
          {/* Chat Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Título del chat
            </label>
            <input
              type="text"
              name="title"
              placeholder="Ej: Asistente Virtual"
              value={data.chatConfig.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sofia-electricGreen focus:border-transparent"
              required
            />
          </div>

          {/* Chat Subtitle */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Subtítulo
            </label>
            <input
              type="text"
              name="subtitle"
              placeholder="Ej: ¿En qué puedo ayudarte?"
              value={data.chatConfig.subtitle}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sofia-electricGreen focus:border-transparent"
              required
            />
          </div>

          {/* Chat Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              name="description"
              placeholder="Ej: Estoy aquí para responder tus preguntas"
              value={data.chatConfig.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sofia-electricGreen focus:border-transparent"
              rows={3}
              required
            />
          </div>

          {/* Welcome Message */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mensaje de bienvenida
            </label>
            <textarea
              name="welcomeMessage"
              placeholder="Ej: ¡Hola! ¿En qué puedo ayudarte hoy?"
              value={data.chatConfig.welcomeMessage}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sofia-electricGreen focus:border-transparent"
              rows={3}
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Este es el primer mensaje que verán los usuarios al abrir el chat
            </p>
          </div>

          {/* Input Placeholder */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Texto del campo de entrada
            </label>
            <input
              type="text"
              name="placeholder"
              placeholder="Ej: Escribe tu mensaje..."
              value={data.chatConfig.placeholder}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sofia-electricGreen focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Preview */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Vista previa:
          </p>
          <div className="border border-gray-200 rounded-lg overflow-hidden max-w-sm">
            {/* Chat Header */}
            <div className="bg-sofia-electricGreen text-white p-4">
              <h4 className="font-semibold">
                {data.chatConfig.title || "Título del chat"}
              </h4>
              <p className="text-sm opacity-90">
                {data.chatConfig.subtitle || "Subtítulo"}
              </p>
            </div>

            {/* Chat Body */}
            <div className="bg-gray-50 p-4 min-h-[200px]">
              <div className="bg-white rounded-lg p-3 shadow-sm mb-3 max-w-[80%]">
                <p className="text-sm text-gray-700">
                  {data.chatConfig.welcomeMessage || "Mensaje de bienvenida"}
                </p>
              </div>
            </div>

            {/* Chat Input */}
            <div className="bg-white border-t p-3">
              <input
                type="text"
                placeholder={
                  data.chatConfig.placeholder || "Escribe tu mensaje..."
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                disabled
              />
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Estos textos son los primeros que verán tus usuarios. Asegúrate
                de que sean claros y amigables.
              </p>
            </div>
          </div>
        </div>
      </div>
    </StepContainer>
  );
};

export default ChatConfigStep;
