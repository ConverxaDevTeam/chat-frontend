import React from "react";
import { HitlTypeWithStatus, HitlStatus } from "@interfaces/hitl.interface";
import { Button } from "@components/common/Button";

interface HitlTypesListProps {
  hitlTypes: HitlTypeWithStatus[];
  isLoading: boolean;
  onEdit: (hitlTypeId: number) => void;
  onDelete: (hitlTypeId: number, name: string) => void;
  onManageUsers: (hitlTypeId: number) => void;
  onCreate: () => void;
  canManage: boolean;
}

export const HitlTypesList: React.FC<HitlTypesListProps> = ({
  hitlTypes,
  isLoading,
  onEdit,
  onDelete,
  onManageUsers,
  onCreate,
  canManage,
}) => {
  const getStatusBadge = (status: HitlStatus, count: number) => {
    const badgeStyles = {
      [HitlStatus.ACTIVE]: "bg-green-100 text-green-800",
      [HitlStatus.INACTIVE]: "bg-yellow-100 text-yellow-800",
      [HitlStatus.DELETED]: "bg-red-100 text-red-800",
    };

    const statusText = {
      [HitlStatus.ACTIVE]: `Activo (${count} usuarios)`,
      [HitlStatus.INACTIVE]: "Inactivo",
      [HitlStatus.DELETED]: "Eliminado",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${badgeStyles[status]}`}
      >
        {statusText[status]}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-48"></div>
                <div className="h-3 bg-gray-300 rounded w-32"></div>
              </div>
              <div className="h-6 bg-gray-300 rounded-full w-24"></div>
            </div>
            <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="flex justify-between items-center">
              <div className="h-3 bg-gray-300 rounded w-40"></div>
              <div className="flex space-x-2">
                <div className="h-8 bg-gray-300 rounded w-20"></div>
                <div className="h-8 bg-gray-300 rounded w-20"></div>
                <div className="h-8 bg-gray-300 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (hitlTypes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay tipos HITL
        </h3>
        <p className="text-gray-500 mb-6">
          Crea tu primer tipo HITL para empezar a gestionar intervenciones
          humanas especializadas.
        </p>
        {canManage && (
          <Button variant="primary" onClick={onCreate}>
            Crear primer tipo HITL
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {canManage && (
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Tipos HITL</h2>
            <p className="text-gray-600 text-sm">
              Gestiona los tipos de intervención humana especializada
            </p>
          </div>
          <Button variant="primary" onClick={onCreate}>
            Crear nuevo tipo
          </Button>
        </div>
      )}

      <div className="grid gap-4">
        {hitlTypes.map(hitlType => (
          <div
            key={hitlType.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  {hitlType.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">ID: {hitlType.id}</p>
              </div>
              {getStatusBadge(hitlType.status, hitlType.assignedUsersCount)}
            </div>

            <p className="text-gray-700 mb-4 leading-relaxed">
              {hitlType.description}
            </p>

            <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
              <div>
                <span>Creado el {formatDate(hitlType.created_at)}</span>
                {hitlType.creator && (
                  <span className="ml-2">
                    por {hitlType.creator.first_name}{" "}
                    {hitlType.creator.last_name}
                  </span>
                )}
              </div>
              <div>
                {hitlType.assignedUsersCount} usuario
                {hitlType.assignedUsersCount !== 1 ? "s" : ""} asignado
                {hitlType.assignedUsersCount !== 1 ? "s" : ""}
              </div>
            </div>

            {canManage && (
              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                <Button
                  variant="default"
                  onClick={() => onManageUsers(hitlType.id)}
                  className="text-xs px-3 h-8"
                >
                  Gestionar usuarios
                </Button>
                <Button
                  variant="default"
                  onClick={() => onEdit(hitlType.id)}
                  className="text-xs px-3 h-8"
                >
                  Editar
                </Button>
                <Button
                  variant="cancel"
                  onClick={() => onDelete(hitlType.id, hitlType.name)}
                  className="text-xs px-3 h-8 text-red-600 border-red-300 hover:bg-red-50"
                >
                  Eliminar
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
