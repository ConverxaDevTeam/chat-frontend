import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";

interface ProtectedRoutesProps {
  children: React.ReactNode;
}

const ProtectedSuperAdmin: React.FC<ProtectedRoutesProps> = ({ children }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user?.is_super_admin) return <Navigate to="/" />;

  return <>{children}</>;
};

export default ProtectedSuperAdmin;
