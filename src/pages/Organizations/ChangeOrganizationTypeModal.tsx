import React, { useState } from "react";
import {
  IOrganization,
  OrganizationType,
} from "@interfaces/organization.interface";
import { changeOrganizationType } from "@services/planService";
import Loading from "@components/Loading";

interface ChangeOrganizationTypeModalProps {
  organization: IOrganization;
  onClose: () => void;
  onPlanUpdated: () => void; // To refresh the list of organizations
}

const ChangeOrganizationTypeModal: React.FC<
  ChangeOrganizationTypeModalProps
> = ({ organization, onClose, onPlanUpdated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<OrganizationType>(
    organization.type
  );
  const [daysToUpdate, setDaysToUpdate] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value as OrganizationType);
    setError(null);
  };

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDaysToUpdate(e.target.value);
    setError(null);
  };

  const handleSubmit = async () => {
    // Validate form
    if (
      selectedType === OrganizationType.CUSTOM &&
      (!daysToUpdate || parseInt(daysToUpdate, 10) <= 0)
    ) {
      setError("Por favor, ingrese un número válido de días para actualizar.");
      return;
    }

    setIsLoading(true);
    try {
      await changeOrganizationType(
        organization.id,
        selectedType,
        selectedType === OrganizationType.CUSTOM
          ? parseInt(daysToUpdate, 10)
          : undefined
      );
      onPlanUpdated(); // Refresh the organization list
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error changing organization type:", error);
      // Error handling is done in the service
    } finally {
      setIsLoading(false);
    }
  };

  const typeLabels = {
    [OrganizationType.PRODUCTION]: "Producción",
    [OrganizationType.MVP]: "MVP",
    [OrganizationType.FREE]: "Gratuito",
    [OrganizationType.CUSTOM]: "Personalizado",
  };

  return (
    <div className="p-5 bg-white rounded-lg min-w-[400px]">
      {isLoading && <Loading />}
      <h3 className="mt-0 mb-5 text-lg font-medium">
        Cambiar Tipo de Organización: {organization.name} (ID: {organization.id}
        )
      </h3>

      {!isLoading && (
        <div>
          <p className="mb-4 text-sm text-gray-600">
            Tipo de Plan Actual:{" "}
            <span className="capitalize">
              {typeLabels[organization.type] || organization.type}
            </span>
          </p>

          <div className="mb-4">
            <label
              htmlFor="organizationType"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Nuevo Tipo de Organización:
            </label>
            <select
              id="organizationType"
              value={selectedType}
              onChange={handleTypeChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#DBEAF2] focus:border-[#DBEAF2]"
            >
              <option value={OrganizationType.PRODUCTION}>
                {typeLabels[OrganizationType.PRODUCTION]}
              </option>
              <option value={OrganizationType.MVP}>
                {typeLabels[OrganizationType.MVP]}
              </option>
              <option value={OrganizationType.FREE}>
                {typeLabels[OrganizationType.FREE]}
              </option>
              <option value={OrganizationType.CUSTOM}>
                {typeLabels[OrganizationType.CUSTOM]}
              </option>
            </select>
          </div>

          {selectedType === OrganizationType.CUSTOM && (
            <div className="mb-4">
              <label
                htmlFor="daysToUpdate"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Días para Actualizar:
              </label>
              <input
                type="number"
                id="daysToUpdate"
                value={daysToUpdate}
                onChange={handleDaysChange}
                placeholder="ej. 30"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#DBEAF2] focus:border-[#DBEAF2]"
              />
            </div>
          )}

          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

          <div className="mt-5 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm text-white bg-[#001130] rounded-md hover:bg-opacity-90"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangeOrganizationTypeModal;
