import { createContext, useContext } from "react";

interface FieldPermissions {
  fields: string[];
}

interface FieldPermissionContextType {
  fieldPermissions: FieldPermissions;
  fetchFieldPermissions: (
    entityClass: string,
    entityId: number,
    token: string,
  ) => Promise<FieldPermissions | undefined>;
}

const FieldPermissionContext = createContext<
  FieldPermissionContextType | undefined
>(undefined);

export const useFieldPermissions = () => {
  const context = useContext(FieldPermissionContext);
  if (!context) {
    throw new Error(
      "useFieldPermissions must be used within a FieldPermissionProvider",
    );
  }
  return context;
};

export type { FieldPermissions };
export default FieldPermissionContext;
