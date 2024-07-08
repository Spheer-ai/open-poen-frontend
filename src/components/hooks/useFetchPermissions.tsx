import { useState, useCallback, useRef } from "react";
import { fetchEntityPermissions } from "../middleware/Api";

export const useFetchEntityPermissions = () => {
  const [permissions, setPermissions] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const permissionsRef = useRef<Record<string, string[]>>({});
  const fetchedRef = useRef<Record<string, boolean>>({});

  const fetchPermissions = useCallback(
    async (entityClass: string, entityId?: number, token?: string) => {
      const key = `${entityClass}-${entityId}`;
      if (fetchedRef.current[key])
        return permissionsRef.current[entityClass] || [];
      try {
        setLoading(true);
        const perms = await fetchEntityPermissions(
          entityClass,
          entityId,
          token,
        );
        permissionsRef.current[entityClass] = perms;
        fetchedRef.current[key] = true;
        setPermissions((prevPermissions) => ({
          ...prevPermissions,
          [entityClass]: perms,
        }));
        return perms;
      } catch (error) {
        console.error(
          `Error fetching permissions for ${entityClass} with ID ${entityId}:`,
          error,
        );
        return [];
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    permissions,
    loading,
    fetchPermissions,
  };
};
