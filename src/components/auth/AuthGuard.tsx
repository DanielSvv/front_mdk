import React from "react";
import { Navigate } from "react-router-dom";

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const token = localStorage.getItem("@EvolutionCRM:token");
  if (!token) {
    return <Navigate to="/admin" replace />;
  }
  return <>{children}</>;
};
