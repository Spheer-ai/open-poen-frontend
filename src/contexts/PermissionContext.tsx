import { createContext, useContext } from "react";

interface PermissionContextType {
  permissions: string[];
  fetchPermissions: (
    entityId?: number,
    token?: string,
  ) => Promise<string[] | undefined>; // Updated return type
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

export default PermissionContext;
