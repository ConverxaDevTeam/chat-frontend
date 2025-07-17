import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HitlTypesList } from "@components/Hitl/HitlTypesList";
import { HitlTypeForm } from "@components/Hitl/HitlTypeForm";
import { HitlUsersManagement } from "@components/Hitl/HitlUsersManagement";
import { useHitlTypes } from "@hooks/useHitlTypes";
import { useHitlUserAssignments } from "@hooks/useHitlUserAssignments";
import { useHitlPermissions } from "@hooks/useHitlPermissions";
import {
  HitlType,
  CreateHitlTypeRequest,
  UpdateHitlTypeRequest,
} from "@interfaces/hitl.interface";
import { toast } from "react-toastify";

type ViewMode = "list" | "create" | "edit" | "manage-users";

const HitlPage: React.FC = () => {
  const navigate = useNavigate();
  const { organizationId } = useParams<{ organizationId: string }>();
  const [currentView, setCurrentView] = useState<ViewMode>("list");
  const [selectedHitlType, setSelectedHitlType] = useState<HitlType | null>(
    null
  );
  const [selectedHitlTypeId, setSelectedHitlTypeId] = useState<number | null>(
    null
  );

  const orgId = organizationId ? parseInt(organizationId) : 0;

  const {
    canManageHitlTypes,
    hasAccessToHitlSystem,
    isLoading: permissionsLoading,
  } = useHitlPermissions({ organizationId: orgId });

  const {
    hitlTypes,
    isLoading: typesLoading,
    isCreating,
    isUpdating,
    isDeleting,
    fetchHitlTypes,
    getHitlTypeDetails,
    createNewHitlType,
    updateExistingHitlType,
    deleteHitlTypeById,
  } = useHitlTypes({ organizationId: orgId });

  const {
    availableUsers,
    isLoading: usersLoading,
    isAssigning,
    isRemoving,
    assignUsers,
    removeUser,
  } = useHitlUserAssignments({
    organizationId: orgId,
    hitlTypeId: selectedHitlTypeId || undefined,
  });

  useEffect(() => {
    if (!organizationId) {
      navigate("/organizations");
      return;
    }

    if (!permissionsLoading && !hasAccessToHitlSystem()) {
      toast.error("No tienes permisos para acceder al sistema HITL");
      navigate(`/organizations/${organizationId}`);
      return;
    }
  }, [organizationId, permissionsLoading, hasAccessToHitlSystem, navigate]);

  const handleCreateClick = () => {
    setSelectedHitlType(null);
    setCurrentView("create");
  };

  const handleEditClick = async (hitlTypeId: number) => {
    const hitlType = await getHitlTypeDetails(hitlTypeId);
    if (hitlType) {
      setSelectedHitlType(hitlType);
      setCurrentView("edit");
    }
  };

  const handleManageUsersClick = async (hitlTypeId: number) => {
    const hitlType = await getHitlTypeDetails(hitlTypeId);
    if (hitlType) {
      setSelectedHitlType(hitlType);
      setSelectedHitlTypeId(hitlTypeId);
      setCurrentView("manage-users");
    }
  };

  const handleDeleteClick = async (
    hitlTypeId: number,
    hitlTypeName: string
  ) => {
    const success = await deleteHitlTypeById(hitlTypeId, hitlTypeName);
    if (success) {
      toast.success("Tipo HITL eliminado correctamente");
    }
  };

  const handleFormSubmit = async (
    data: CreateHitlTypeRequest | UpdateHitlTypeRequest
  ): Promise<boolean> => {
    let success = false;

    if (currentView === "create") {
      success = await createNewHitlType(data as CreateHitlTypeRequest);
    } else if (currentView === "edit" && selectedHitlType) {
      success = await updateExistingHitlType(
        selectedHitlType.id,
        data as UpdateHitlTypeRequest
      );
    }

    if (success) {
      setCurrentView("list");
      setSelectedHitlType(null);
    }

    return success;
  };

  const handleFormCancel = () => {
    setCurrentView("list");
    setSelectedHitlType(null);
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedHitlType(null);
    setSelectedHitlTypeId(null);
    fetchHitlTypes(); // Refresh the list
  };

  const handleAssignUsers = async (userIds: number[]): Promise<boolean> => {
    const success = await assignUsers(userIds, () => {
      // Refresh hitl type details after assignment
      if (selectedHitlType) {
        getHitlTypeDetails(selectedHitlType.id).then(updatedType => {
          if (updatedType) {
            setSelectedHitlType(updatedType);
          }
        });
      }
    });
    return success;
  };

  const handleRemoveUser = async (
    userId: number,
    userName: string
  ): Promise<boolean> => {
    const success = await removeUser(userId, userName, () => {
      // Refresh hitl type details after removal
      if (selectedHitlType) {
        getHitlTypeDetails(selectedHitlType.id).then(updatedType => {
          if (updatedType) {
            setSelectedHitlType(updatedType);
          }
        });
      }
    });
    return success;
  };

  if (permissionsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!hasAccessToHitlSystem()) {
    return (
      <div className="text-center">
        <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-12 h-12 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Acceso denegado
        </h3>
        <p className="text-gray-500">
          No tienes permisos para acceder al sistema HITL.
        </p>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case "create":
        return (
          <HitlTypeForm
            mode="create"
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isSubmitting={isCreating}
          />
        );

      case "edit":
        return (
          <HitlTypeForm
            mode="edit"
            initialData={selectedHitlType}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isSubmitting={isUpdating}
          />
        );

      case "manage-users":
        return selectedHitlType ? (
          <HitlUsersManagement
            hitlType={selectedHitlType}
            availableUsers={availableUsers}
            isLoading={usersLoading}
            isAssigning={isAssigning}
            isRemoving={isRemoving}
            onAssignUsers={handleAssignUsers}
            onRemoveUser={handleRemoveUser}
            onBack={handleBackToList}
          />
        ) : null;

      case "list":
      default:
        return (
          <HitlTypesList
            hitlTypes={hitlTypes}
            isLoading={typesLoading}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onManageUsers={handleManageUsersClick}
            onCreate={handleCreateClick}
            canManage={canManageHitlTypes()}
          />
        );
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-auto w-full">
      {/* Breadcrumb */}
      {currentView !== "list" && (
        <nav className="flex items-center space-x-2 text-sm text-gray-500 my-3 px-2">
          <button
            onClick={handleBackToList}
            className="hover:text-app-superDark transition-colors font-normal"
          >
            Sistema HITL
          </button>
          <span>/</span>
          <span className="text-app-superDark">
            {currentView === "create" && "Crear tipo HITL"}
            {currentView === "edit" && "Editar tipo HITL"}
            {currentView === "manage-users" && "Gestionar usuarios"}
          </span>
        </nav>
      )}

      {/* Main Content */}
      <div className="flex-1">{renderContent()}</div>

      {/* Loading Overlay for operations */}
      {isDeleting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-900">Procesando...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HitlPage;
