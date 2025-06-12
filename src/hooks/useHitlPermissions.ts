import { useState, useEffect, useCallback, useMemo } from "react";
import { HitlPermissions } from "@interfaces/hitl.interface";
import { useRoleAuth } from "./useRoleAuth";
import { OrganizationRoleType } from "@utils/interfaces";

interface UseHitlPermissionsProps {
  organizationId: number;
}

export const useHitlPermissions = ({
  organizationId,
}: UseHitlPermissionsProps) => {
  const { hasOrganizationRole, organizationRoles } = useRoleAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const userRoles = useMemo(() => 
    organizationRoles(organizationId), 
    [organizationRoles, organizationId]
  );
  
  const userRole = useMemo(() => userRoles[0], [userRoles]);

  const permissions = useMemo((): HitlPermissions => {
    if (!organizationId || userRoles.length === 0) {
      return {
        canManageHitlTypes: false,
        canReceiveHitlNotifications: false,
      };
    }

    const canManage = hasOrganizationRole(organizationId, [OrganizationRoleType.OWNER]);
    const canReceive = hasOrganizationRole(organizationId, [OrganizationRoleType.HITL, OrganizationRoleType.OWNER]);

    return {
      canManageHitlTypes: canManage,
      canReceiveHitlNotifications: canReceive,
    };
  }, [organizationId, userRoles.length, hasOrganizationRole]);

  const updatePermissions = useCallback(() => {
    if (!organizationId || userRoles.length === 0) {
      setHasError(true);
      return;
    }
    setHasError(false);
  }, [organizationId, userRoles.length]);

  const isOwner = useCallback((): boolean => {
    return userRole === OrganizationRoleType.OWNER;
  }, [userRole]);

  const isHitlUser = useCallback((): boolean => {
    return userRole === OrganizationRoleType.HITL;
  }, [userRole]);

  const canManageHitlTypes = useCallback((): boolean => {
    return permissions.canManageHitlTypes;
  }, [permissions.canManageHitlTypes]);

  const canReceiveHitlNotifications = useCallback((): boolean => {
    return permissions.canReceiveHitlNotifications;
  }, [permissions.canReceiveHitlNotifications]);

  const hasAccessToHitlSystem = useCallback((): boolean => {
    return permissions.canManageHitlTypes || permissions.canReceiveHitlNotifications;
  }, [permissions.canManageHitlTypes, permissions.canReceiveHitlNotifications]);

  useEffect(() => {
    if (organizationId) {
      setIsLoading(true);
      updatePermissions();
      setIsLoading(false);
    }
  }, [organizationId, updatePermissions]);

  return {
    userRole,
    permissions,
    isLoading,
    hasError,
    fetchUserRole: updatePermissions,
    isOwner,
    isHitlUser,
    canManageHitlTypes,
    canReceiveHitlNotifications,
    hasAccessToHitlSystem,
  };
};
