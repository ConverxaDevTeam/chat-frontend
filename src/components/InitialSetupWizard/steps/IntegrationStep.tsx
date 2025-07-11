import React, { useState } from "react";
import { StepComponentProps } from "../types";

const IntegrationStep: React.FC<StepComponentProps> = ({
  data,
  updateData,
  integrationId,
}) => {
  const [currentDomain, setCurrentDomain] = useState("");
  const [activeTab, setActiveTab] = useState<"script" | "iframe" | "wordpress">("script");

  const handleAddDomain = () => {
    const domain = currentDomain.trim();
    if (domain && isValidDomain(domain)) {
      updateData("integration", {
        domains: [...data.integration.domains, domain],
      });
      setCurrentDomain("");
    }
  };

  const removeDomain = (index: number) => {
    const newDomains = data.integration.domains.filter((_, i) => i !== index);
    updateData("integration", { domains: newDomains });
  };

  const isValidDomain = (domain: string) => {
    // Basic domain validation
    const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
    return domainRegex.test(domain);
  };

  const getScriptCode = () => {
    return `<!-- SOF.IA Chat Widget -->
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://chat.sofi.ia/widget.js';
    script.setAttribute('data-integration-id', '${integrationId || "YOUR_INTEGRATION_ID"}');
    script.async = true;
    document.head.appendChild(script);
  })();
</script>
<!-- End SOF.IA Chat Widget -->`;
  };

  const getIframeCode = () => {
    return `<iframe
  src="https://chat.sofi.ia/embed/${integrationId || "YOUR_INTEGRATION_ID"}"
  width="400"
  height="600"
  frameborder="0"
  title="SOF.IA Chat"
></iframe>`;
  };

  const getWordPressInstructions = () => {
    return `1. Instala el plugin de SOF.IA desde el repositorio de WordPress
2. Activa el plugin desde el panel de administración
3. Ve a Configuración > SOF.IA Chat
4. Ingresa tu ID de integración: ${integrationId || "YOUR_INTEGRATION_ID"}
5. Guarda los cambios`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Integrar chat
        </h3>
        <p className="text-sm text-gray-600">
          Configura dónde se mostrará tu chat y obtén el código de integración
        </p>
      </div>

      {/* Domain Configuration */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Dominios permitidos
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={currentDomain}
            onChange={(e) => setCurrentDomain(e.target.value)}
            placeholder="ejemplo.com"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sofia-electricGreen focus:border-transparent"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddDomain();
              }
            }}
          />
          <button
            type="button"
            onClick={handleAddDomain}
            className="px-4 py-2 bg-sofia-electricGreen text-white rounded-md hover:bg-opacity-90"
          >
            Agregar
          </button>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Agrega los dominios donde quieres que funcione el chat
        </p>
      </div>

      {/* Domains List */}
      {data.integration.domains.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">
            Dominios configurados:
          </p>
          <ul className="space-y-2">
            {data.integration.domains.map((domain, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
              >
                <span className="text-sm text-gray-700">{domain}</span>
                <button
                  type="button"
                  onClick={() => removeDomain(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Integration Methods */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-3">
          Método de integración:
        </p>
        <div className="flex space-x-2 mb-4">
          <button
            type="button"
            onClick={() => setActiveTab("script")}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === "script"
                ? "bg-sofia-electricGreen text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Script
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("iframe")}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === "iframe"
                ? "bg-sofia-electricGreen text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            iFrame
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("wordpress")}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === "wordpress"
                ? "bg-sofia-electricGreen text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            WordPress
          </button>
        </div>

        {/* Code Display */}
        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          {activeTab === "script" && (
            <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
              {getScriptCode()}
            </pre>
          )}
          {activeTab === "iframe" && (
            <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
              {getIframeCode()}
            </pre>
          )}
          {activeTab === "wordpress" && (
            <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
              {getWordPressInstructions()}
            </pre>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            const code = activeTab === "script"
              ? getScriptCode()
              : activeTab === "iframe"
              ? getIframeCode()
              : getWordPressInstructions();
            navigator.clipboard.writeText(code);
            // You could add a toast notification here
          }}
          className="mt-3 text-sm text-sofia-electricGreen hover:text-sofia-superDark font-medium"
        >
          Copiar código
        </button>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-yellow-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Puedes agregar más dominios o cambiar el método de integración más tarde
              desde el panel de administración.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationStep;
