import React, { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";

interface PermissionContextType {
  globalPermissions: string[];
  fetchGlobalPermissions: (token: string) => Promise<string[]>;
}

const PermissionContext = createContext<PermissionContextType | undefined>(
  undefined,
);

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionProvider");
  }
  return context;
};

interface PermissionProviderProps {
  children: React.ReactNode;
}

const PermissionProvider: React.FC<PermissionProviderProps> = ({
  children,
}) => {
  const { user } = useAuth();
  const [globalPermissions, setGlobalPermissions] = useState<string[]>([]);

  const fetchGlobalPermissions = async (token: string) => {
    const perms = [];
    setGlobalPermissions(perms);
    return perms;
  };

  return (
    <PermissionContext.Provider
      value={{
        globalPermissions,
        fetchGlobalPermissions,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};

export default PermissionProvider;
