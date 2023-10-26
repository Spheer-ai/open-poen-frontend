import { createContext, useContext } from "react";

interface PermissionContextType {
  permissions: Record<string, string[]>;
  fetchPermissions: (
    entityClass: string,
    entityId?: number,
    token?: string,
  ) => Promise<string[] | undefined>;
  globalPermissions: string[];
  fetchGlobalPermissions: (token: string) => Promise<string[]>;
  entityClassPermissions: Record<string, string[]>;
  fetchEntityClassPermissions: (
    entityClass: string,
    token: string,
  ) => Promise<void>;
}

const PermissionContext = createContext<PermissionContextType | undefined>({
  permissions: {},
  fetchPermissions: async () => undefined,
  globalPermissions: [],
  fetchGlobalPermissions: async () => [],
  entityClassPermissions: {},
  fetchEntityClassPermissions: async () => {},
});

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionProvider");
  }
  return context;
};

export default PermissionContext;
