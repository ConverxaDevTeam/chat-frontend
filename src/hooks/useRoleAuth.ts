import { useSelector } from "react-redux";
import { RootState } from "@store/index";
import { OrganizationRoleType } from "@utils/interfaces";

interface UseRoleAuthReturn {
  hasRole: (roles?: OrganizationRoleType[]) => boolean;
  hasOrganizationRole: (
    organizationId: number,
    roles?: OrganizationRoleType[]
  ) => boolean;
  isSuperAdmin: boolean;
  userRoles: OrganizationRoleType[];
  organizationRoles: (organizationId: number) => OrganizationRoleType[];
}

export const useRoleAuth = (): UseRoleAuthReturn => {
  const { user, myOrganizations } = useSelector(
    (state: RootState) => state.auth
  );

  const userRoles = myOrganizations.map(org => org.role);
  const isSuperAdmin = user?.is_super_admin ?? false;

  const hasRole = (roles?: OrganizationRoleType[]): boolean => {
    if (!roles?.length) return true;
    return isSuperAdmin || roles.some(role => userRoles.includes(role));
  };

  const organizationRoles = (organizationId: number): OrganizationRoleType[] =>
    myOrganizations
      .filter(org => org.organization?.id === organizationId)
      .map(org => org.role);

  const hasOrganizationRole = (
    organizationId: number,
    roles?: OrganizationRoleType[]
  ): boolean => {
    if (!roles?.length) return true;
    const orgRoles = organizationRoles(organizationId);
    return isSuperAdmin || roles.some(role => orgRoles.includes(role));
  };

  return {
    hasRole,
    hasOrganizationRole,
    isSuperAdmin,
    userRoles,
    organizationRoles,
  };
};
