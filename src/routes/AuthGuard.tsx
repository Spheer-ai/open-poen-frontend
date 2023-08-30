// AuthGuard: Not implemented yet
import React from "react";
import { Navigate } from "react-router-dom";

interface AuthGuardProps {
  isAuth: boolean;
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ isAuth, children }) => {
  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default AuthGuard;
