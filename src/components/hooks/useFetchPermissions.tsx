import { useState } from "react";
import { fetchUserPermissions } from "../middleware/Api";

export const useFetchPermissions = () => {
  const [permissions, setPermissions] = useState<string[]>([]);

  const fetchPermissions = async (entityId?: number, token?: string) => {
    try {
      const userPermissions = await fetchUserPermissions(entityId, token);
      setPermissions(userPermissions);
      return userPermissions;
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  };

  return { permissions, fetchPermissions };
};
