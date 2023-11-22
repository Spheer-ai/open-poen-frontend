import React, { useEffect, useState } from "react";
import EditIcon from "/edit-icon.svg";
import DeleteIcon from "/delete-icon.svg";
import { Grant } from "../../types/GranListType";
import { usePermissions } from "../../contexts/PermissionContext";
import { useAuth } from "../../contexts/AuthContext";
import styles from "../../assets/scss/RegulationDetail.module.scss";

interface GrantListProps {
  grants: Grant[];
  hasCreateGrantPermission: boolean;
  onAddGrantClick: () => void;
  onEditGrantClick: (grant: Grant) => void;
  onDeleteGrantClick: (grantId: number) => void;
  onAddOfficerClick: (grantId: number) => void;
  grantPermissions: Record<number, string[]>;
}

const GrantList: React.FC<GrantListProps> = ({
  grants,
  hasCreateGrantPermission,
  onAddGrantClick,
  onEditGrantClick,
  onDeleteGrantClick,
  onAddOfficerClick,
}) => {
  const { user } = useAuth();
  const { fetchPermissions } = usePermissions();
  const [permissionsFetched, setPermissionsFetched] = useState<boolean>(false);
  const [grantPermissionsMap, setGrantPermissionsMap] = useState<
    Record<number, string[]>
  >({});

  useEffect(() => {
    async function fetchGrantPermissions() {
      try {
        const grantIds = grants.map((grant) => grant.id);
        const grantPermissionsMap: Record<number, string[]> = {};

        for (const grantId of grantIds) {
          const permissions: string[] | undefined = await fetchPermissions(
            "Grant",
            grantId,
            user?.token || "",
          );
          grantPermissionsMap[grantId] = permissions || [];
        }

        setPermissionsFetched(true);
        setGrantPermissionsMap((prev) => ({
          ...prev,
          ...grantPermissionsMap,
        }));
      } catch (error) {
        console.error("Failed to fetch grant permissions:", error);
      }
    }

    fetchGrantPermissions();
  }, [grants, user?.token]);

  return (
    <>
      <div className={styles["grant-container"]}>
        <h3 className={styles["section-title"]}>BESCHIKKINGEN</h3>
        {hasCreateGrantPermission && (
          <button className={styles["add-button"]} onClick={onAddGrantClick}>
            Beschikking toevoegen
          </button>
        )}
      </div>
      <ul className={styles["grant-list"]}>
        {grants.map((grant) => (
          <li
            key={`grant-${grant.id}-${grant.name}`}
            className={styles["grant-item"]}
          >
            {grant.name} | {grant.reference} | € {grant.budget}
            <div className={styles["button-container"]}>
              {grantPermissionsMap[grant.id]?.includes("edit") && (
                <button
                  className={styles["edit-button"]}
                  onClick={() => onEditGrantClick(grant)}
                >
                  <img src={EditIcon} alt="Edit" className={styles["icon"]} />
                </button>
              )}
              {grantPermissionsMap[grant.id]?.includes("delete") && (
                <button
                  className={styles["delete-button"]}
                  onClick={() => onDeleteGrantClick(grant.id)}
                >
                  <img
                    src={DeleteIcon}
                    alt="Delete"
                    className={styles["icon"]}
                  />
                </button>
              )}
              {hasCreateGrantPermission && (
                <button
                  className={styles["add-button"]}
                  onClick={() => onAddOfficerClick(grant.id)}
                >
                  Penvoerders
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default GrantList;
