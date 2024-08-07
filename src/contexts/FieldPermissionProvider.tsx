import React, { useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { getEditFieldsForEntity } from "../components/middleware/Api";
import FieldPermissionContext, {
  FieldPermissions,
} from "./FieldPermissionContext";

interface FieldPermissionProviderProps {
  children: React.ReactNode;
}

const FieldPermissionProvider: React.FC<FieldPermissionProviderProps> = ({
  children,
}) => {
  const { user } = useAuth();
  const [fieldPermissions, setFieldPermissions] = useState<FieldPermissions>({
    fields: [],
  });

  const fetchFieldPermissions = useCallback(
    async (
      entityClass: string,
      entityId: number,
      token: string,
    ): Promise<FieldPermissions | undefined> => {
      try {
        const permissions = await getEditFieldsForEntity(
          entityClass,
          entityId,
          token,
        );
        const permissionsObject = permissions || { fields: [] };
        setFieldPermissions(permissionsObject);
        return permissionsObject;
      } catch (error) {
        return undefined;
      }
    },
    [],
  );

  return (
    <FieldPermissionContext.Provider
      value={{
        fieldPermissions,
        fetchFieldPermissions,
      }}
    >
      {children}
    </FieldPermissionContext.Provider>
  );
};

export default FieldPermissionProvider;
