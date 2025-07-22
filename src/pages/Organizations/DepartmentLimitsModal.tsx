import React, { useState, useEffect } from "react";
import { IOrganization } from "@interfaces/organization.interface";
import { getOrganizationLimits } from "@services/organizationLimits";

interface DepartmentLimitsModalProps {
  organization: IOrganization;
  onClose: () => void;
  onSave: (organizationId: number, departmentLimit: number) => Promise<void>;
}

const DepartmentLimitsModal: React.FC<DepartmentLimitsModalProps> = ({
  organization,
  onClose,
  onSave,
}) => {
  const [departmentLimit, setDepartmentLimit] = useState<number>(5);
  const [originalLimit, setOriginalLimit] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentLimits = async () => {
      try {
        setIsInitialLoading(true);
        const limits = await getOrganizationLimits(organization.id);

        if (limits && limits.departmentLimit !== undefined) {
          setDepartmentLimit(limits.departmentLimit);
          setOriginalLimit(limits.departmentLimit);
        } else {
          setOriginalLimit(null);
          console.log(
            "No se encontraron límites configurados, usando valor por defecto"
          );
        }
      } catch (err) {
        console.error("Error cargando límites:", err);
        // No mostrar error por límites no encontrados, es normal
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchCurrentLimits();
  }, [organization.id]);

  const handleSave = async () => {
    if (departmentLimit < 1) {
      setError("El límite debe ser mayor a 0");
      return;
    }

    if (
      organization.departments &&
      departmentLimit < organization.departments
    ) {
      setError(
        `El límite no puede ser menor que los departamentos actuales (${organization.departments})`
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onSave(organization.id, departmentLimit);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar límites");
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges = originalLimit !== departmentLimit;

  if (isInitialLoading) {
    return (
      <div className="p-6 bg-white rounded-lg max-w-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">
          Gestionar Límites de Departamentos
        </h3>
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-app-electricGreen border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">
            Cargando límites actuales...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg max-w-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">
        Gestionar Límites de Departamentos
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Organización:
          </label>
          <p className="text-sm text-gray-600 capitalize">
            {organization.name}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Plan:
          </label>
          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 capitalize">
            {organization.type}
          </span>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Departamentos Actuales:
          </label>
          <p className="text-sm text-gray-600">
            {organization.departments !== undefined
              ? organization.departments
              : 0}
          </p>
        </div>

        {originalLimit !== null && (
          <div className="bg-blue-50 p-3 rounded-md mb-4">
            <p className="text-sm text-blue-700">
              <span className="font-medium">Límite actual:</span>{" "}
              {originalLimit} departamentos
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nuevo Límite Máximo de Departamentos:
          </label>
          <input
            type="number"
            min={organization.departments || 1}
            value={departmentLimit}
            onChange={e => setDepartmentLimit(parseInt(e.target.value) || 1)}
            disabled={isLoading}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-app-electricGreen focus:border-app-electricGreen text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Ej: 10"
          />
          <p className="text-xs text-gray-500 mt-1">
            Debe ser mayor o igual a los departamentos actuales (
            {organization.departments || 0})
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-app-electricGreen border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-600">
                Cargando límites actuales...
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading || !hasChanges}
            className="px-4 py-2 bg-app-electricGreen text-app-superDark rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-app-superDark border-t-transparent rounded-full animate-spin"></div>
            )}
            {isLoading
              ? "Guardando..."
              : hasChanges
                ? "Guardar Cambios"
                : "Sin Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentLimitsModal;
