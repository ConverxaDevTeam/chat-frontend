import React from "react";
import { HitlType, HitlUserWithRole } from "@interfaces/hitl.interface";

interface HitlAssignmentStatsProps {
  hitlType: HitlType;
  availableUsers: HitlUserWithRole[];
}

export const HitlAssignmentStats: React.FC<HitlAssignmentStatsProps> = ({
  hitlType,
  availableUsers,
}) => {
  const assignedUsers = hitlType.userHitlTypes.length;
  const availableForAssignment = availableUsers.filter(
    user =>
      !hitlType.userHitlTypes.some(assignment => assignment.user_id === user.id)
  ).length;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h3 className="text-sm font-medium text-blue-900 mb-3 flex items-center">
        <svg
          className="w-4 h-4 mr-2"
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
        Gestión de usuarios - {hitlType.name}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center bg-white rounded-md p-3">
          <div className="text-2xl font-bold text-blue-600">
            {assignedUsers}
          </div>
          <div className="text-sm text-blue-700">Usuarios asignados</div>
        </div>
        <div className="text-center bg-white rounded-md p-3">
          <div className="text-2xl font-bold text-gray-600">
            {availableForAssignment}
          </div>
          <div className="text-sm text-gray-700">Disponibles para asignar</div>
        </div>
      </div>

      {availableForAssignment === 0 && assignedUsers > 0 && (
        <div className="mt-3 bg-green-100 border border-green-300 rounded-md p-3">
          <div className="flex items-center space-x-2">
            <svg
              className="w-4 h-4 text-green-500 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <div className="text-sm text-green-700">
              Todos los usuarios HITL de la organización están asignados a este
              tipo.
            </div>
          </div>
        </div>
      )}

      {assignedUsers === 0 && (
        <div className="mt-3 bg-yellow-100 border border-yellow-300 rounded-md p-3">
          <div className="flex items-center space-x-2">
            <svg
              className="w-4 h-4 text-yellow-500 flex-shrink-0"
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
            <div className="text-sm text-yellow-700">
              Este tipo HITL estará <strong>inactivo</strong> hasta que asignes
              al menos un usuario.
            </div>
          </div>
        </div>
      )}

      {availableUsers.length === 0 && (
        <div className="mt-3 bg-red-100 border border-red-300 rounded-md p-3">
          <div className="flex items-center space-x-2">
            <svg
              className="w-4 h-4 text-red-500 flex-shrink-0"
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
            <div className="text-sm text-red-700">
              No hay usuarios con rol <strong>HITL</strong> en esta
              organización. Contacta al administrador para asignar roles HITL.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
