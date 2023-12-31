import React, { useEffect, useState } from "react";
import EditIcon from "/edit-icon.svg";
import DeleteIcon from "/delete-icon.svg";
import { Grant } from "../../types/GranListType";
import { usePermissions } from "../../contexts/PermissionContext";
import { useAuth } from "../../contexts/AuthContext";
import styles from "../../assets/scss/RegulationDetail.module.scss";
import { fetchGrantDetails } from "../middleware/Api";

interface GrantListProps {
  grants: Grant[];
  hasCreateGrantPermission: boolean;
  onAddGrantClick: () => void;
  onEditGrantClick: (grant: Grant) => void;
  onDeleteGrantClick: (grantId: number) => void;
  onAddOfficerClick: (grantId: number) => void;
  onAddFundClick: (grantId: number) => void;
  grantPermissions: Record<number, string[]>;
  regulationId?: number;
  funderId?: number;
}

const GrantList: React.FC<GrantListProps> = ({
  grants,
  hasCreateGrantPermission,
  onAddGrantClick,
  onEditGrantClick,
  onDeleteGrantClick,
  onAddOfficerClick,
  onAddFundClick,
  regulationId,
  funderId,
}) => {
  const { user } = useAuth();
  const { fetchPermissions } = usePermissions();
  const [permissionsFetched, setPermissionsFetched] = useState<boolean>(false);
  const [grantPermissionsMap, setGrantPermissionsMap] = useState<
    Record<number, string[]>
  >({});
  const [initiativeCounts, setInitiativeCounts] = useState<
    Record<number, number>
  >({});

  useEffect(() => {
    async function fetchInitiativeCounts() {
      try {
        const counts = await Promise.all(
          grants.map(async (grant) => {
            const response = await fetchGrantDetails(
              user?.token || "",
              funderId,
              regulationId,
              grant.id,
            );
            return response.initiatives.length;
          }),
        );

        const countMap: Record<number, number> = {};
        grants.forEach((grant, index) => {
          countMap[grant.id] = counts[index];
        });

        setInitiativeCounts(countMap);
      } catch (error) {
        console.error("Failed to fetch initiative counts:", error);
      }
    }

    fetchInitiativeCounts();
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
              <button
                className={styles["add-button"]}
                onClick={() => onAddFundClick(grant.id)}
              >
                Initiatief{" "}
                <span className={styles["initiative-count"]}>
                  ({initiativeCounts[grant.id] || 0})
                </span>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default GrantList;
