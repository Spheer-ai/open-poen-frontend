import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getEditFieldsForEntity } from "../components/middleware/Api";
import FieldPermissionContext from "./FieldPermissionContext";

interface FieldPermissionProviderProps {
  children: React.ReactNode;
}

const FieldPermissionProvider: React.FC<FieldPermissionProviderProps> = ({
  children,
}) => {
  const { user } = useAuth();
  const [fieldPermissions, setFieldPermissions] = useState<string[]>([]);

  const fetchFieldPermissionsForEntities = async (
    entityClass: string,
    entityId: number,
    token: string,
  ): Promise<string[] | undefined> => {
    try {
      const permissions = await getEditFieldsForEntity(
        entityClass,
        entityId,
        token,
      );
      return permissions || [];
    } catch (error) {
      console.error("Error fetching field permissions:", error);
      return undefined;
    }
  };

  return (
    <FieldPermissionContext.Provider
      value={{
        fieldPermissions,
        fetchFieldPermissions: fetchFieldPermissionsForEntities,
      }}
    >
      {children}
    </FieldPermissionContext.Provider>
  );
};

export default FieldPermissionProvider;
