import { createContext, useContext } from "react";

interface FieldPermissionContextType {
  fieldPermissions: string[];
  fetchFieldPermissions: (
    entityClass: string,
    entityId: number,
    token: string,
  ) => Promise<string[] | undefined>;
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

export default FieldPermissionContext;
