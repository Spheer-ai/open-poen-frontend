import { createContext, useContext } from "react";

interface PermissionContextType {
  permissions: string[];
  fetchPermissions: (
    entityId?: number,
    token?: string,
  ) => Promise<string[] | undefined>;
  globalPermissions: string[]; // Add this
  fetchGlobalPermissions: (token: string) => Promise<string[]>;
}

const PermissionContext = createContext<PermissionContextType | undefined>({
  permissions: [],
  fetchPermissions: async () => [],
  globalPermissions: [],
  fetchGlobalPermissions: async () => [],
});

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionProvider");
  }
  return context;
};

export default PermissionContext;
