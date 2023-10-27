import React, { useEffect, useState } from "react";
import PermissionContext from "./PermissionContext";
import { useFetchPermissions } from "../components/hooks/useFetchPermissions";
import { useAuth } from "./AuthContext";

interface PermissionProviderProps {
  children: React.ReactNode;
}

const PermissionProvider: React.FC<PermissionProviderProps> = ({
  children,
}) => {
  const { permissions, fetchPermissions } = useFetchPermissions();
  const { user } = useAuth();
  const [entityClassPermissions, setEntityClassPermissions] = useState<
    Record<string, string[]>
  >({});

  useEffect(() => {
    if (user && user.token) {
      const entities = ["User", "Funder", "Regulation", "Grant"];
      entities.forEach(async (entityClass) => {
        const perms = await fetchPermissions(
          entityClass,
          undefined,
          user.token,
        );
        setEntityClassPermissions((prev) => ({
          ...prev,
          [entityClass]: perms || [],
        }));
      });
    }
  }, []);

  return (
    <PermissionContext.Provider
      value={{
        permissions,
        fetchPermissions,
        globalPermissions: [],
        fetchGlobalPermissions: async () => [],
        entityClassPermissions,
        fetchEntityClassPermissions: async () => {},
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};

export default PermissionProvider;
