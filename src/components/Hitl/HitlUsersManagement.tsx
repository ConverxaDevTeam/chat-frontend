import React, { useState } from "react";
import {
  HitlType,
  HitlUserWithRole,
  HitlUserAssignment,
} from "@interfaces/hitl.interface";
import { Button } from "@components/common/Button";
import { HitlAssignmentStats } from "./HitlAssignmentStats";

interface HitlUsersManagementProps {
  hitlType: HitlType;
  availableUsers: HitlUserWithRole[];
  isLoading: boolean;
  isAssigning: boolean;
  isRemoving: boolean;
  onAssignUsers: (userIds: number[]) => Promise<boolean>;
  onRemoveUser: (userId: number, userName: string) => Promise<boolean>;
  onBack: () => void;
}

export const HitlUsersManagement: React.FC<HitlUsersManagementProps> = ({
  hitlType,
  availableUsers,
  isLoading,
  isAssigning,
  isRemoving,
  onAssignUsers,
  onRemoveUser,
  onBack,
}) => {
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [showAddUsers, setShowAddUsers] = useState(false);

  const assignedUserIds = hitlType.userHitlTypes.map(
    assignment => assignment.user_id
  );
  const unassignedUsers = availableUsers.filter(
    user => !assignedUserIds.includes(user.id)
  );

  const handleUserSelection = (userId: number, isSelected: boolean) => {
    setSelectedUserIds(prev =>
      isSelected ? [...prev, userId] : prev.filter(id => id !== userId)
    );
  };

  const handleAssignSelected = async () => {
    if (selectedUserIds.length === 0) return;

    const success = await onAssignUsers(selectedUserIds);
    if (success) {
      setSelectedUserIds([]);
      setShowAddUsers(false);
    }
  };

  const handleRemoveUser = async (assignment: HitlUserAssignment) => {
    const userName =
      `${assignment.user.first_name} ${assignment.user.last_name}`.trim() ||
      assignment.user.email;
    await onRemoveUser(assignment.user_id, userName);
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
      <div className="bg-white rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-64 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-32"></div>
                    <div className="h-3 bg-gray-300 rounded w-24"></div>
                  </div>
                </div>
                <div className="h-8 bg-gray-300 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6">
      {/* Estadísticas de asignaciones */}
      <HitlAssignmentStats
        hitlType={hitlType}
        availableUsers={availableUsers}
      />

      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <button
              onClick={onBack}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h2 className="text-xl font-semibold text-gray-900">
              Gestionar usuarios - {hitlType.name}
            </h2>
          </div>
          <p className="text-gray-600 text-sm">
            Asigna o remueve usuarios con rol HITL para este tipo de
            intervención. Un usuario puede estar asignado a múltiples tipos
            HITL.
          </p>
        </div>
        {unassignedUsers.length > 0 && (
          <Button
            variant="primary"
            onClick={() => setShowAddUsers(!showAddUsers)}
            disabled={isAssigning || isRemoving}
          >
            {showAddUsers ? "Cancelar" : "Asignar usuarios"}
          </Button>
        )}
      </div>

      {/* Add Users Section */}
      {showAddUsers && unassignedUsers.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Seleccionar usuarios para asignar (múltiple selección)
          </h3>
          <div className="space-y-2 mb-4">
            {unassignedUsers.map(user => (
              <label
                key={user.id}
                className="flex items-center space-x-3 p-2 hover:bg-blue-100 rounded-md cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedUserIds.includes(user.id)}
                  onChange={e => handleUserSelection(user.id, e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  disabled={isAssigning}
                />
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {(user.first_name?.[0] || user.email[0]).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {user.first_name && user.last_name
                        ? `${user.first_name} ${user.last_name}`
                        : user.email}
                    </div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {user.role.toUpperCase()}
                </span>
              </label>
            ))}
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="cancel"
              onClick={() => {
                setShowAddUsers(false);
                setSelectedUserIds([]);
              }}
              disabled={isAssigning}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleAssignSelected}
              disabled={selectedUserIds.length === 0 || isAssigning}
            >
              {isAssigning
                ? "Asignando..."
                : `Asignar ${selectedUserIds.length} usuario${selectedUserIds.length !== 1 ? "s" : ""}`}
            </Button>
          </div>
        </div>
      )}

      {/* Assigned Users List */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Usuarios asignados ({hitlType.userHitlTypes.length})
        </h3>

        {hitlType.userHitlTypes.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
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
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              No hay usuarios asignados
            </h4>
            <p className="text-gray-500 mb-4">
              Este tipo HITL estará inactivo hasta que asignes al menos un
              usuario.
            </p>
            {unassignedUsers.length > 0 ? (
              <Button
                variant="primary"
                onClick={() => setShowAddUsers(true)}
                disabled={isAssigning || isRemoving}
              >
                Asignar primer usuario
              </Button>
            ) : (
              <p className="text-sm text-gray-400">
                No hay usuarios con rol HITL disponibles para asignar en esta
                organización.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {hitlType.userHitlTypes.map(assignment => (
              <div
                key={assignment.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                    {(
                      assignment.user.first_name?.[0] ||
                      assignment.user.email[0]
                    ).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {assignment.user.first_name && assignment.user.last_name
                        ? `${assignment.user.first_name} ${assignment.user.last_name}`
                        : assignment.user.email}
                    </div>
                    <div className="text-xs text-gray-500">
                      {assignment.user.email}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Asignado el {formatDate(assignment.created_at)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    ACTIVO
                  </span>
                  <Button
                    variant="cancel"
                    onClick={() => handleRemoveUser(assignment)}
                    disabled={isRemoving || isAssigning}
                    className="text-xs px-3 h-8 text-red-600 border-red-300 hover:bg-red-50"
                  >
                    {isRemoving ? "Removiendo..." : "Remover"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Gestión de asignaciones
            </h3>
            <div className="text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Puedes asignar múltiples usuarios a este tipo HITL</li>
                <li>Los usuarios pueden estar asignados a varios tipos HITL</li>
                <li>
                  Los usuarios asignados recibirán notificaciones automáticas
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
