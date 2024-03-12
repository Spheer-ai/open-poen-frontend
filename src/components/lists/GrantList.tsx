import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [initiativeCounts, setInitiativeCounts] = useState<
    Record<number, number>
  >({});
  const [grantPermissions, setGrantPermissions] = useState<
    Record<number, string[]>
  >({});
  const [firstInitiativeIdMap, setFirstInitiativeIdMap] = useState<
    Record<number, number | null>
  >({});
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchInitiativeCounts() {
      try {
        const countsAndInitiatives = await Promise.all(
          grants.map(async (grant) => {
            const response = await fetchGrantDetails(
              user?.token || "",
              funderId,
              regulationId,
              grant.id,
            );

            const count = response.initiatives.length;
            const firstInitiativeId =
              response.initiatives.length > 0
                ? response.initiatives[0].id
                : null;

            return { grantId: grant.id, count, firstInitiativeId };
          }),
        );

        const countMap: Record<number, number> = {};
        const tempFirstInitiativeIdMap: Record<number, number | null> = {};

        countsAndInitiatives.forEach(
          ({ grantId, count, firstInitiativeId }) => {
            countMap[grantId] = count;
            tempFirstInitiativeIdMap[grantId] = firstInitiativeId;
          },
        );

        setInitiativeCounts(countMap);
        setFirstInitiativeIdMap(tempFirstInitiativeIdMap);
      } catch (error) {
        console.error("Failed to fetch initiative counts:", error);
      }
    }

    fetchInitiativeCounts();
  }, [grants, user?.token]);

  useEffect(() => {
    async function fetchUserPermissions() {
      try {
        if (user && user.token) {
          const grantIds = grants.map((grant) => grant.id);
          const permissions: Record<number, string[]> = {};

          for (const grantId of grantIds) {
            const userPermissions: string[] | undefined =
              await fetchPermissions("Grant", grantId, user.token);

            permissions[grantId] = userPermissions || [];
          }

          setGrantPermissions(permissions);
        }
      } catch (error) {
        console.error("Failed to fetch user permissions:", error);
      }
    }

    fetchUserPermissions();
  }, [grants, user]);

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
            <span
              className={styles["grant-name"]}
              style={{
                cursor:
                  firstInitiativeIdMap[grant.id] !== null ? "pointer" : "auto",
              }}
              onClick={() => {
                const firstInitiativeId = firstInitiativeIdMap[grant.id];
                if (firstInitiativeId !== null) {
                  navigate(`/funds/${firstInitiativeId}/activities`);
                }
              }}
            >
              {grant.reference} | {grant.name}
              {" | "}€{" "}
              {grant.budget.toLocaleString("nl-NL", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <div className={styles["button-container"]}>
              {grantPermissions[grant.id] &&
                grantPermissions[grant.id].includes("edit") && (
                  <button
                    className={styles["edit-button"]}
                    onClick={() => onEditGrantClick(grant)}
                  >
                    <img src={EditIcon} alt="Edit" className={styles["icon"]} />
                  </button>
                )}
              {grantPermissions[grant.id] &&
                grantPermissions[grant.id].includes("delete") && (
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
