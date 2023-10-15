import React, { useEffect } from "react";
import PermissionContext from "./PermissionContext";
import { useFetchPermissions } from "../components/hooks/useFetchPermissions";
import { useAuth } from "./AuthContext";
import { PermissionProviderProps } from "../types/PermissionProviderTypes";

const PermissionProvider: React.FC<PermissionProviderProps> = ({
  children,
}) => {
  const {
    permissions,
    fetchPermissionsWithEntityId,
    globalPermissions,
    fetchGlobalPermissions,
  } = useFetchPermissions();
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.token) {
      fetchGlobalPermissions(user.token);
    }
  }, [user]);

  return (
    <PermissionContext.Provider
      value={{
        permissions,
        fetchPermissions: fetchPermissionsWithEntityId,
        globalPermissions,
        fetchGlobalPermissions,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};

export default PermissionProvider;
