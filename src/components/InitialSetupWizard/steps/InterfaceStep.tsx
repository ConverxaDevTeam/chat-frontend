import React from "react";
import { StepComponentProps } from "../types";
import StepContainer from "../components/StepContainer";

const InterfaceStep: React.FC<StepComponentProps> = ({ data, updateData }) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    updateData("interface", { [name]: value });
  };

  const positions = [
    { value: "bottom-right", label: "Abajo a la derecha" },
    { value: "bottom-left", label: "Abajo a la izquierda" },
    { value: "top-right", label: "Arriba a la derecha" },
    { value: "top-left", label: "Arriba a la izquierda" },
  ];

  const buttonStyles = [
    { value: "rounded", label: "Redondeado" },
    { value: "square", label: "Cuadrado" },
  ];

  return (
    <StepContainer
      title="Personalizar interfaz"
      subtitle="Define cómo se verá el chat en tu sitio web"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column - Color Settings */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Colores</h4>

            {/* Primary Color */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Color principal
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  name="primaryColor"
                  value={data.interface.primaryColor}
                  onChange={handleInputChange}
                  className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={data.interface.primaryColor}
                  onChange={e =>
                    updateData("interface", { primaryColor: e.target.value })
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="#10B981"
                />
              </div>
            </div>

            {/* Background Color */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Color de fondo
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  name="backgroundColor"
                  value={data.interface.backgroundColor}
                  onChange={handleInputChange}
                  className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={data.interface.backgroundColor}
                  onChange={e =>
                    updateData("interface", { backgroundColor: e.target.value })
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="#FFFFFF"
                />
              </div>
            </div>

            {/* Text Color */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Color del texto
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  name="textColor"
                  value={data.interface.textColor}
                  onChange={handleInputChange}
                  className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={data.interface.textColor}
                  onChange={e =>
                    updateData("interface", { textColor: e.target.value })
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="#333333"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Position and Style */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Posición y estilo</h4>

            {/* Position */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Posición del chat
              </label>
              <select
                name="position"
                value={data.interface.position}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sofia-electricGreen focus:border-transparent"
              >
                {positions.map(position => (
                  <option key={position.value} value={position.value}>
                    {position.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Button Style */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Estilo del botón
              </label>
              <select
                name="buttonStyle"
                value={data.interface.buttonStyle}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sofia-electricGreen focus:border-transparent"
              >
                {buttonStyles.map(style => (
                  <option key={style.value} value={style.value}>
                    {style.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Vista previa:
          </p>
          <div className="relative bg-gray-100 rounded-lg h-64 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-500">Tu sitio web</p>
            </div>

            {/* Chat Button Preview */}
            <div
              className={`absolute ${
                data.interface.position.includes("bottom")
                  ? "bottom-4"
                  : "top-4"
              } ${
                data.interface.position.includes("right") ? "right-4" : "left-4"
              }`}
            >
              <button
                className={`w-14 h-14 flex items-center justify-center shadow-lg transition-transform hover:scale-110 ${
                  data.interface.buttonStyle === "rounded"
                    ? "rounded-full"
                    : "rounded-lg"
                }`}
                style={{ backgroundColor: data.interface.primaryColor }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Color Suggestions */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Combinaciones sugeridas:
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                primary: "#10B981",
                bg: "#FFFFFF",
                text: "#1F2937",
                name: "Verde moderno",
              },
              {
                primary: "#3B82F6",
                bg: "#FFFFFF",
                text: "#1E293B",
                name: "Azul profesional",
              },
              {
                primary: "#8B5CF6",
                bg: "#FFFFFF",
                text: "#1F2937",
                name: "Púrpura creativo",
              },
              {
                primary: "#F59E0B",
                bg: "#FFFFFF",
                text: "#1F2937",
                name: "Naranja energético",
              },
              {
                primary: "#EF4444",
                bg: "#FFFFFF",
                text: "#1F2937",
                name: "Rojo dinámico",
              },
              {
                primary: "#1F2937",
                bg: "#FFFFFF",
                text: "#1F2937",
                name: "Negro elegante",
              },
            ].map(theme => (
              <button
                key={theme.name}
                type="button"
                onClick={() =>
                  updateData("interface", {
                    primaryColor: theme.primary,
                    backgroundColor: theme.bg,
                    textColor: theme.text,
                  })
                }
                className="text-left p-3 border border-gray-200 rounded-lg hover:border-sofia-electricGreen hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: theme.primary }}
                  />
                  <div
                    className="w-6 h-6 rounded border border-gray-200"
                    style={{ backgroundColor: theme.bg }}
                  />
                  <div
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: theme.text }}
                  />
                </div>
                <p className="text-xs font-medium text-gray-700">
                  {theme.name}
                </p>
              </button>
            ))}
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
                Los colores deben contrastar bien entre sí para garantizar una
                buena legibilidad. El botón del chat debe ser fácilmente visible
                en tu sitio.
              </p>
            </div>
          </div>
        </div>
      </div>
    </StepContainer>
  );
};

export default InterfaceStep;
