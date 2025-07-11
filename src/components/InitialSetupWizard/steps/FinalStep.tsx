import React from "react";
import { StepComponentProps } from "../types";
import { CheckCircle } from "lucide-react";
import StepContainer from "../components/StepContainer";

const FinalStep: React.FC<StepComponentProps> = ({ data }) => {
  return (
    <StepContainer
      title="¡Configuración completada!"
      subtitle="Tu asistente virtual está listo para comenzar a trabajar"
    >
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <h4 className="font-semibold text-gray-900">
            Resumen de configuración:
          </h4>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Organización:</span>
              <span className="text-sm font-medium text-gray-900">
                {data.organization.name}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Departamento:</span>
              <span className="text-sm font-medium text-gray-900">
                {data.department.name}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Agente:</span>
              <span className="text-sm font-medium text-gray-900">
                Agente configurado
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">
                Base de conocimiento:
              </span>
              <span className="text-sm font-medium text-gray-900">
                {data.knowledge.files.length > 0
                  ? `${data.knowledge.files.length} archivo(s) cargado(s)`
                  : "Sin archivos (puedes agregar después)"}
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">
                Dominios configurados:
              </span>
              <span className="text-sm font-medium text-gray-900">
                {data.integration.domains.length > 0
                  ? data.integration.domains.join(", ")
                  : "Sin dominios configurados"}
              </span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-3">Próximos pasos:</h4>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span className="text-sm text-gray-700">
                Integra el código del chat en tu sitio web siguiendo las
                instrucciones del paso anterior
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span className="text-sm text-gray-700">
                Agrega más información a la base de conocimiento para mejorar
                las respuestas
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span className="text-sm text-gray-700">
                Configura funciones adicionales para expandir las capacidades de
                tu agente
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span className="text-sm text-gray-700">
                Monitorea las conversaciones y ajusta la configuración según sea
                necesario
              </span>
            </li>
          </ul>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 hover:border-sofia-electricGreen transition-colors cursor-pointer">
            <div className="flex items-center space-x-3 mb-2">
              <svg
                className="w-6 h-6 text-sofia-electricGreen"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h5 className="font-medium text-gray-900">
                Base de conocimiento
              </h5>
            </div>
            <p className="text-sm text-gray-600">
              Agrega más documentos y archivos para mejorar las respuestas
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:border-sofia-electricGreen transition-colors cursor-pointer">
            <div className="flex items-center space-x-3 mb-2">
              <svg
                className="w-6 h-6 text-sofia-electricGreen"
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
              <h5 className="font-medium text-gray-900">Probar chat</h5>
            </div>
            <p className="text-sm text-gray-600">
              Prueba tu asistente virtual antes de publicarlo
            </p>
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                Tu organización ha sido creada exitosamente. Ahora puedes
                acceder al panel de administración para gestionar todos los
                aspectos de tu asistente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </StepContainer>
  );
};

export default FinalStep;
