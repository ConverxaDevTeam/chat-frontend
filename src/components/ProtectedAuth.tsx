import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { OrganizationRoleType } from "@utils/interfaces";

interface ProtectedRoutesProps {
  children: React.ReactNode;
  roles?: OrganizationRoleType[];
}

const ProtectedAuth: React.FC<ProtectedRoutesProps> = ({ children, roles }) => {
  const { authenticated, user, myOrganizations } = useSelector(
    (state: RootState) => state.auth
  );

  if (!authenticated) return <Navigate to="/" />;

  if (roles) {
    const userRoles = myOrganizations.map(org => org.role);
    const hasRequiredRole =
      user?.is_super_admin || roles.some(role => userRoles.includes(role));

    if (!hasRequiredRole) {
      return <Navigate to="/dashboard" />;
    }
  }

  return <>{children}</>;
};

export default ProtectedAuth;
