import React, {
  useEffect,
  useMemo,
  useRef,
  useCallback,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import TopNavigationBar from "../ui/top-navigation-bar/TopNavigationBar";
import styles from "../../assets/scss/Funds.module.scss";
import { usePermissions } from "../../contexts/PermissionContext";
import { useAuth } from "../../contexts/AuthContext";
import LoadingDot from "../animation/LoadingDot";
import useInitiatives from "../hooks/useInitiatives";
import { calculateBarWidth, formatCurrency } from "../utils/calculations";

export default function Funds() {
  console.log("Funds component rendering");

  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchPermissions } = usePermissions();
  const [entityPermissions, setEntityPermissions] = useState<string[]>([]);
  const [onlyMine, setOnlyMine] = useState(false);
  const initialFetchDoneRef = useRef(false);

  useEffect(() => {
    console.log("Current user:", user);
    console.log("Entity permissions:", entityPermissions);
    console.log("Only mine filter:", onlyMine);
  }, [user, entityPermissions, onlyMine]);

  const hasPermission = useMemo(() => {
    console.log("Calculating hasPermission");
    return entityPermissions.includes("create");
  }, [entityPermissions]);

  const limit = 3;

  const {
    initiatives,
    isLoadingMoreInitiatives,
    loadMoreInitiatives,
    resetInitiatives,
    hasMoreInitiatives,
    fetchAndDisplayInitiatives,
  } = useInitiatives(user?.token, limit, onlyMine);

  const sidePanelRef = useRef<HTMLDivElement | null>(null);

  const checkBottom = useCallback(() => {
    const sidePanel = sidePanelRef.current;
    if (sidePanel && !isLoadingMoreInitiatives && hasMoreInitiatives) {
      const scrollY = sidePanel.scrollTop;
      const panelHeight = sidePanel.clientHeight;
      const contentHeight = sidePanel.scrollHeight;
      const threshold = 50;
      if (contentHeight - (scrollY + panelHeight) < threshold) {
        loadMoreInitiatives();
      }
    }
  }, [isLoadingMoreInitiatives, hasMoreInitiatives, loadMoreInitiatives]);

  useEffect(() => {
    if (user?.token && entityPermissions.length === 0) {
      console.log("Fetching permissions for user", user);
      fetchPermissions("Funder", undefined, user.token)
        .then((permissions) => {
          console.log("Permissions fetched", permissions);
          setEntityPermissions(permissions || []);
        })
        .catch((error) => {
          console.error("Failed to fetch permissions:", error);
        });
    }
  }, [user?.token, entityPermissions.length, fetchPermissions]);

  useEffect(() => {
    if (user && !initialFetchDoneRef.current) {
      console.log(
        "Initial fetch: resetInitiatives and fetchAndDisplayInitiatives",
      );
      resetInitiatives();
      fetchAndDisplayInitiatives(0, limit);
      initialFetchDoneRef.current = true;
    }
  }, [user, onlyMine, resetInitiatives, fetchAndDisplayInitiatives, limit]);

  useEffect(() => {
    const sidePanel = sidePanelRef.current;
    if (sidePanel) {
      console.log("Adding scroll event listener to side panel");
      sidePanel.addEventListener("scroll", checkBottom);
      return () => {
        console.log("Removing scroll event listener from side panel");
        sidePanel.removeEventListener("scroll", checkBottom);
      };
    }
  }, [checkBottom]);

  const handleSearch = () => {
    // Implement search functionality here if needed
  };

  const navigateToActivities = (
    initiativeId: number,
    initiativeName: string,
  ) => {
    navigate(`/funds/${initiativeId}/${initiativeName}`, {
      state: { initiativeName },
    });
  };

  const toggleFilter = (filter: boolean) => {
    console.log("Toggling filter", filter);
    setOnlyMine(filter);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles["container"]}>
      <div className={styles["side-panel"]} ref={sidePanelRef}>
        <TopNavigationBar
          title={`Initiatieven`}
          showSettings={false}
          showCta={false}
          onSettingsClick={() => {}}
          onCtaClick={() => {}}
          onSearch={handleSearch}
          hasPermission={hasPermission}
          showSearch={false}
          showHomeLink={true}
          showTitleOnSmallScreen={false}
        />
        {user && (
          <div className={styles["filter-buttons"]}>
            <button
              className={
                onlyMine ? styles["filter-button"] : styles["active-button"]
              }
              onClick={() => toggleFilter(false)}
            >
              Alle Initiatieven
            </button>
            <button
              className={
                onlyMine ? styles["active-button"] : styles["filter-button"]
              }
              onClick={() => toggleFilter(true)}
            >
              Mijn Initiatieven
            </button>
          </div>
        )}
        <ul className={styles["shared-unordered-list"]}>
          {initiatives.map((initiative, index) => (
            <div
              className={`${styles["shared-styling"]} ${styles["initiative-fade-in"]}`}
              key={`${initiative?.id}-${index}`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() =>
                navigateToActivities(initiative?.id, initiative?.name)
              }
            >
              <li className={styles["shared-name"]}>
                <strong>{initiative?.name}</strong>
              </li>
              <div className={styles["values-bar"]}>
                <div
                  key={`expenses-${initiative?.id}`}
                  className={styles["expenses-bar"]}
                  style={{
                    width: calculateBarWidth(
                      initiative?.budget,
                      initiative?.expenses,
                    ).spentWidth,
                  }}
                ></div>
                <div
                  key={`income-${initiative?.id}`}
                  className={styles["income-bar"]}
                  style={{
                    width: calculateBarWidth(
                      initiative?.budget,
                      initiative?.expenses,
                    ).availableWidth,
                  }}
                ></div>
              </div>
              <li className={styles["shared-list"]}>
                <div className={styles["shared-values"]}>
                  <label>Toegekend:</label>
                  <span>€{formatCurrency(initiative?.budget)}</span>
                </div>
                <div className={styles["shared-values"]}>
                  <label className={styles["value-expenses"]}>Besteed:</label>
                  <span>€{formatCurrency(Math.abs(initiative?.expenses))}</span>
                </div>
                <div className={styles["shared-values"]}>
                  <label className={styles["value-income"]}>Beschikbaar:</label>
                  <span>€{formatCurrency(initiative?.beschikbaar ?? 0)}</span>
                </div>
              </li>
              {initiative?.hidden && (
                <span className={styles["hidden-label"]}>Verborgen</span>
              )}
            </div>
          ))}
          {isLoadingMoreInitiatives && (
            <div className={styles["loading-container-small"]}>
              <LoadingDot delay={0} />
              <LoadingDot delay={0.1} />
              <LoadingDot delay={0.1} />
              <LoadingDot delay={0.2} />
              <LoadingDot delay={0.2} />
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}
