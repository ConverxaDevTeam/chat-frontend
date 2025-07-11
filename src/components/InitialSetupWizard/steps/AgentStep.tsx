import React from "react";
import { StepComponentProps } from "../types";
import { CheckCircle } from "lucide-react";

const AgentStep: React.FC<StepComponentProps> = ({ data, agentId }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Agente creado automáticamente
        </h3>
        <p className="text-sm text-gray-600">
          Se ha creado un agente predeterminado para tu departamento
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">
          Información del agente
        </h4>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">ID del agente:</p>
            <p className="text-sm font-medium text-gray-900">
              {agentId || "Creándose..."}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Departamento:</p>
            <p className="text-sm font-medium text-gray-900">
              {data.department.name}
            </p>
          </div>
        </div>
      </div>

      {/* Agent features */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-3">
          Características del agente:
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              icon: "🤖",
              title: "Procesamiento inteligente",
              description:
                "Utiliza IA avanzada para entender y responder consultas",
            },
            {
              icon: "⚡",
              title: "Respuestas rápidas",
              description: "Proporciona información inmediata a los usuarios",
            },
            {
              icon: "📚",
              title: "Aprendizaje continuo",
              description: "Mejora con cada interacción y nueva información",
            },
            {
              icon: "🔧",
              title: "Personalizable",
              description: "Puedes configurar sus respuestas y comportamiento",
            },
          ].map(feature => (
            <div
              key={feature.title}
              className="flex items-start space-x-3 p-4 bg-white border border-gray-200 rounded-lg"
            >
              <span className="text-2xl">{feature.icon}</span>
              <div>
                <p className="font-medium text-sm text-gray-900">
                  {feature.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-gray-700">
          Próximos pasos para tu agente:
        </p>
        <ul className="space-y-2">
          <li className="flex items-start">
            <span className="text-sofia-electricGreen mr-2">•</span>
            <span className="text-sm text-gray-600">
              Agrega información a la base de conocimiento en el siguiente paso
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-sofia-electricGreen mr-2">•</span>
            <span className="text-sm text-gray-600">
              Personaliza las respuestas y el comportamiento después de la
              configuración inicial
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-sofia-electricGreen mr-2">•</span>
            <span className="text-sm text-gray-600">
              Configura funciones adicionales para expandir las capacidades
            </span>
          </li>
        </ul>
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
              El agente ya está listo para recibir configuración. En los
              siguientes pasos podrás agregar conocimiento y personalizar su
              comportamiento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentStep;
