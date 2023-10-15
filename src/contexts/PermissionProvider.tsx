import React, { useState, useEffect } from "react";
import PermissionContext from "./PermissionContext";
import { useFetchPermissions } from "../components/hooks/useFetchPermissions";
import { PermissionProviderProps } from "../types/PermissionProviderTypes";

const PermissionProvider: React.FC<PermissionProviderProps> = ({
  children,
}) => {
  const [storedPermissions, setStoredPermissions] = useState<string[]>([]);
  const { permissions, fetchPermissions } = useFetchPermissions();

  useEffect(() => {
    fetchPermissions();
  }, []);

  useEffect(() => {
    setStoredPermissions(permissions);
  }, [permissions]);

  return (
    <PermissionContext.Provider
      value={{
        permissions: storedPermissions,
        setPermissions: setStoredPermissions,
        fetchPermissions,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};

export default PermissionProvider;
