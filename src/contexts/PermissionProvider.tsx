import React, { useEffect } from "react";
import PermissionContext from "./PermissionContext";
import { useFetchPermissions } from "../components/hooks/useFetchPermissions";
import { PermissionProviderProps } from "../types/PermissionProviderTypes";

const PermissionProvider: React.FC<PermissionProviderProps> = ({
  children,
}) => {
  const { permissions, fetchPermissions } = useFetchPermissions();

  useEffect(() => {
    fetchPermissions();
  }, []);

  return (
    <PermissionContext.Provider value={{ permissions, fetchPermissions }}>
      {children}
    </PermissionContext.Provider>
  );
};

export default PermissionProvider;
