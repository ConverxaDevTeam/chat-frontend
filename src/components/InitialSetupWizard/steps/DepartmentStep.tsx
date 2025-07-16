import React from "react";
import { StepComponentProps } from "../types";
import StepContainer from "../components/StepContainer";

const DepartmentStep: React.FC<StepComponentProps> = ({ data, updateData }) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    updateData("department", { [name]: value });
  };

  return (
    <StepContainer
      title="Crear departamento"
      subtitle="Los departamentos te permiten organizar tus agentes por áreas o equipos"
    >
      <div className="space-y-6">
        <div className="space-y-4">
          {/* Department Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nombre del departamento
            </label>
            <input
              type="text"
              name="name"
              placeholder="Ej: Ventas, Soporte, Marketing"
              value={data.department.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-app-electricGreen focus:border-transparent"
              required
            />
          </div>

          {/* Department Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              name="description"
              placeholder="Describe el propósito de este departamento..."
              value={data.department.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-app-electricGreen focus:border-transparent"
              rows={4}
              required
            />
          </div>
        </div>

        {/* Common department templates */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Sugerencias de departamentos comunes:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: "Ventas", description: "Gestión de clientes y ventas" },
              {
                name: "Soporte",
                description: "Atención al cliente y soporte técnico",
              },
              {
                name: "Marketing",
                description: "Estrategias y campañas de marketing",
              },
              {
                name: "Recursos Humanos",
                description: "Gestión de personal y talento",
              },
            ].map(dept => (
              <button
                key={dept.name}
                type="button"
                onClick={() => updateData("department", dept)}
                className="text-left p-3 border border-gray-200 rounded-lg hover:border-app-electricGreen hover:bg-gray-50 transition-colors"
              >
                <p className="font-medium text-sm text-gray-900">{dept.name}</p>
                <p className="text-xs text-gray-500 mt-1">{dept.description}</p>
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
                Los departamentos agrupan agentes relacionados y facilitan la
                organización de tu equipo de trabajo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </StepContainer>
  );
};

export default DepartmentStep;
