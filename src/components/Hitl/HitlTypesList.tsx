import React, { useState } from "react";
import { HitlTypeWithStatus, HitlStatus } from "@interfaces/hitl.interface";
import { Button } from "@components/common/Button";
import ContextMenu from "@components/ContextMenu";
import PageContainer from "@components/PageContainer";

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
  const getStatusBadge = (status: HitlStatus, assignedUsersCount: number) => {
    if (status === HitlStatus.ACTIVE && assignedUsersCount > 0) {
      return (
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 border-[0.5px] border-green-300">
          Activo
        </span>
      );
    } else if (status === HitlStatus.ACTIVE && assignedUsersCount === 0) {
      return (
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 border-[0.5px] border-yellow-300">
          Sin usuarios
        </span>
      );
    } else {
      return (
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 border-[0.5px] border-red-300">
          Inactivo
        </span>
      );
    }
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
      <PageContainer
        title="Tipos HITL"
        buttonText={canManage ? "+ Crear nuevo tipo HITL" : undefined}
        onButtonClick={canManage ? onCreate : undefined}
      >
        {canManage && (
          <div className="mb-6">
            <p className="text-app-newGray text-sm font-normal">
              Gestiona los tipos de intervención humana especializada
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {hitlTypes.map(hitlType => (
            <div
              key={hitlType.id}
              className="bg-white rounded border-[0.5px] border-app-lightGray p-4 relative flex flex-col h-full"
            >
              <div className="absolute top-3 right-3 flex items-center gap-2">
                {getStatusBadge(hitlType.status, hitlType.assignedUsersCount)}
                {canManage && (
                  <button
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={e =>
                      handleOpenContextMenu(e, hitlType.id, hitlType.name)
                    }
                  >
                    <img
                      src="/mvp/ellipsis.svg"
                      alt="Opciones"
                      className="w-4 h-4"
                    />
                  </button>
                )}
              </div>

              <div className="flex flex-col items-start mb-2">
                <div className="flex items-center w-full">
                  <h3 className="text-lg font-semibold text-app-superDark truncate max-w-[65%]">
                    {hitlType.name}
                  </h3>
                </div>
                <p className="text-xs font-normal text-app-newGray">
                  ID: {hitlType.id}
                </p>
              </div>

              <div className="flex-grow mb-2">
                <p className="text-sm font-normal text-gray-700 line-clamp-2 text-left">
                  {hitlType.description}
                </p>
                {hitlType.description && hitlType.description.length > 100 && (
                  <button
                    className="text-xs text-app-navyBlue mt-1 hover:underline"
                    onClick={() => onEdit(hitlType.id)}
                  >
                    Ver más
                  </button>
                )}
              </div>

              {hitlType.assignedUsersCount > 0 && (
                <div className="flex flex-row gap-4 items-center mb-3">
                  <p className="text-sm font-semibold text-app-superDark">
                    Usuarios asignados
                  </p>
                  <div className="flex flex-row items-center">
                    {[...Array(Math.min(3, hitlType.assignedUsersCount))].map(
                      (_, index) => (
                        <div
                          key={index}
                          className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center -ml-2 first:ml-0 border-[0.5px] border-white shadow-sm"
                          style={{ zIndex: 10 - index }}
                        >
                          <span className="text-xs font-medium text-gray-600">
                            {String.fromCharCode(65 + index)}
                            {String.fromCharCode(75 + index)}
                          </span>
                        </div>
                      )
                    )}
                    {hitlType.assignedUsersCount > 3 && (
                      <div
                        className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center -ml-2 border-[0.5px] border-white shadow-sm"
                        style={{ zIndex: 7 }}
                      >
                        <span className="text-xs font-medium text-gray-600">
                          +{hitlType.assignedUsersCount - 3}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {canManage && (
                <div className="mt-auto">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onDelete(hitlType.id, hitlType.name)}
                      className="w-full px-4 py-1 text-app-newGray border rounded-[4px] text-sm font-normal"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => onEdit(hitlType.id)}
                      className="w-full px-4 py-1 bg-app-superDark text-white rounded-[4px] text-sm font-normal hover:bg-opacity-50 transition-all whitespace-nowrap"
                    >
                      Editar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </PageContainer>

      {contextMenu.isOpen && (
        <ContextMenu
          position={{ x: contextMenu.x, y: contextMenu.y }}
          onClose={handleCloseContextMenu}
        >
          <button
            className="w-full text-left flex items-center gap-2 text-app-superDark"
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
