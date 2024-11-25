import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";

interface ProtectedRoutesProps {
  children: React.ReactNode;
}

const ProtectedAuth: React.FC<ProtectedRoutesProps> = ({ children }) => {
  const { authenticated } = useSelector((state: RootState) => state.auth);

  if (!authenticated) return <Navigate to="/" />;

  return <>{children}</>;
};

export default ProtectedAuth;
