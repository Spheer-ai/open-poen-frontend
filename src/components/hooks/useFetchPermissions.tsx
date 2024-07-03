import { useState, useCallback, useRef } from "react";
import { fetchEntityPermissions } from "../middleware/Api";

export const useFetchEntityPermissions = () => {
  const [permissions, setPermissions] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  const fetchPermissions = useCallback(
    async (entityClass: string, token?: string) => {
      if (fetchedRef.current) return;
      try {
        setLoading(true);
        const perms = await fetchEntityPermissions(
          entityClass,
          undefined,
          token,
        );
        setPermissions((prevPermissions) => ({
          ...prevPermissions,
          [entityClass]: perms,
        }));
        fetchedRef.current = true;
        return perms;
      } catch (error) {
        console.error(`Error fetching permissions for ${entityClass}:`, error);
        return undefined;
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
