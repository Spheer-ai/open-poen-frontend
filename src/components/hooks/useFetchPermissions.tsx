import { useState } from "react";
import { fetchEntityPermissions } from "../middleware/Api";

export const useFetchPermissions = () => {
  const [permissions, setPermissions] = useState<Record<string, string[]>>({});

  const fetchPermissions = async (
    entityClass: string,
    entityId?: number,
    token?: string,
  ) => {
    try {
      const perms = await fetchEntityPermissions(entityClass, entityId, token);
      setPermissions((prevPermissions) => ({
        ...prevPermissions,
        [entityClass]: perms,
      }));
      return perms;
    } catch (error) {
      console.error(`Error fetching permissions for ${entityClass}:`, error);
    }
  };

  return {
    permissions,
    fetchPermissions,
  };
};
