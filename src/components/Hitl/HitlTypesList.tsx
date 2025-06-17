import React, { useState } from "react";
import { HitlTypeWithStatus, HitlStatus } from "@interfaces/hitl.interface";
import { Button } from "@components/common/Button";
import ContextMenu from "@components/ContextMenu";

interface HitlTypesListProps {
  hitlTypes: HitlTypeWithStatus[];
  isLoading: boolean;
  onEdit: (hitlTypeId: number) => void;
  onDelete: (hitlTypeId: number, name: string) => void;
  onManageUsers: (hitlTypeId: number) => void;
  onCreate: () => void;
  canManage: boolean;
}

interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  hitlTypeId: number;
  hitlTypeName: string;
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
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    isOpen: false,
    x: 0,
    y: 0,
    hitlTypeId: 0,
    hitlTypeName: "",
  });

  const handleOpenContextMenu = (
    e: React.MouseEvent,
    hitlTypeId: number,
    hitlTypeName: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
      hitlTypeId,
      hitlTypeName,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(prev => ({ ...prev, isOpen: false }));
  };
  const getStatusBadge = (status: HitlStatus, _count: number) => {
    const badgeStyles = {
      [HitlStatus.ACTIVE]:
        "bg-green-100 text-green-800 border border-green-200",
      [HitlStatus.INACTIVE]:
        "bg-yellow-100 text-yellow-800 border border-yellow-200",
      [HitlStatus.DELETED]: "bg-red-100 text-red-800 border border-red-200",
    };

    const statusText = {
      [HitlStatus.ACTIVE]: "Activo",
      [HitlStatus.INACTIVE]: "Inactivo",
      [HitlStatus.DELETED]: "Eliminado",
    };

    return (
      <span
        className={`px-2 py-0.5 rounded text-xs font-medium ${badgeStyles[status]}`}
      >
        {statusText[status]}
      </span>
    );
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
      <div className="text-center">
        {canManage && (
          <Button variant="primary" onClick={onCreate}>
            Crear primer tipo HITL
          </Button>
        )}
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
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {canManage && (
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-sofia-superDark">
              Tipos HITL
            </h2>
            <p className="text-sofia-newGray text-sm font-normal">
              Gestiona los tipos de intervención humana especializada
            </p>
          </div>
          <Button
            variant="primary"
            onClick={onCreate}
            className="!flex-none !w-[190px]"
          >
            Crear nuevo tipo HITL
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {hitlTypes.map(hitlType => (
          <div
            key={hitlType.id}
            className="bg-white rounded border border-app-lightGray p-5 relative flex flex-col h-full"
          >
            {canManage && (
              <button
                className="absolute top-3 left-3 text-gray-500 hover:text-gray-700 transition-colors"
                onClick={e =>
                  handleOpenContextMenu(e, hitlType.id, hitlType.name)
                }
              >
                <img
                  src="/mvp/ellipsis.svg"
                  alt="Opciones"
                  className="w-5 h-5"
                />
              </button>
            )}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                {hitlType.assignedUsersCount} usuario
                {hitlType.assignedUsersCount !== 1 ? "s" : ""}
              </span>
              {getStatusBadge(hitlType.status, hitlType.assignedUsersCount)}
            </div>

            <div className="flex flex-col items-center ">
              <div className="w-14 h-14 rounded-full border border-app-lightGray flex items-center justify-center mb-2">
                <span className="text-xl font-semibold text-gray-800">
                  {hitlType.name.substring(0, 2).toUpperCase()}
                </span>
              </div>
              <h3 className="text-lg font-medium text-center">
                {hitlType.name}
              </h3>
              <p className="text-xs font-normal text-app-newGray text-center">
                ID: {hitlType.id}
              </p>
            </div>

            <div className="flex-grow text-center mb-4">
              <p className="text-sm font-normal text-gray-700 line-clamp-2">
                {hitlType.description}
              </p>
            </div>

            {canManage && (
              <div className="mt-auto">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => {
                      console.log(
                        "ELIMINAR HITL TYPE CLICKED:",
                        hitlType.id,
                        hitlType.name
                      );
                      onDelete(hitlType.id, hitlType.name);
                    }}
                    className="w-full px-4 py-1 text-app-newGray border rounded text-sm font-normal"
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={() => onEdit(hitlType.id)}
                    className="w-full px-4 py-1 bg-sofia-superDark text-white rounded-[4px] text-sm font-normal hover:bg-opacity-50 transition-all"
                  >
                    Editar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {contextMenu.isOpen && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={handleCloseContextMenu}
        >
          <button
            className="w-full text-left flex items-center gap-2 text-sofia-superDark"
            onClick={() => {
              onManageUsers(contextMenu.hitlTypeId);
              handleCloseContextMenu();
            }}
          >
            <img
              src="/mvp/settings.svg"
              alt="Gestionar usuarios"
              className="w-4 h-4"
            />
            Gestionar usuarios
          </button>
        </ContextMenu>
      )}
    </div>
  );
};
