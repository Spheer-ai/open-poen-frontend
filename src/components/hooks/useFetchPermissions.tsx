import { useState } from "react";
import { fetchUserPermissions } from "../middleware/Api";

export const useFetchPermissions = () => {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [globalPermissions, setGlobalPermissions] = useState<string[]>([]);

  const fetchPermissionsWithEntityId = async (
    entityId?: number,
    token?: string,
  ) => {
    try {
      const userPermissions = await fetchUserPermissions(entityId, token);
      console.log("API Response for permissions:", userPermissions);
      setPermissions(userPermissions);
      return userPermissions;
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  };

  const fetchGlobalPermissions = async (token: string): Promise<string[]> => {
    const globalPerms = await fetchUserPermissions(undefined, token);
    setGlobalPermissions(globalPerms);
    return globalPerms;
  };

  return {
    permissions,
    fetchPermissionsWithEntityId,
    globalPermissions,
    fetchGlobalPermissions,
  };
};
