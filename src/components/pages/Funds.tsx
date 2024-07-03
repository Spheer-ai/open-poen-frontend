import React, { useEffect, useRef, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNavigationBar from "../ui/top-navigation-bar/TopNavigationBar";
import styles from "../../assets/scss/Funds.module.scss";
import { useAuth } from "../../contexts/AuthContext";
import LoadingDot from "../animation/LoadingDot";
import useInitiatives from "../hooks/useInitiatives";
import { calculateBarWidth, formatCurrency } from "../utils/calculations";

export default function Funds() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [onlyMine, setOnlyMine] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Funds component rendering");
    console.log("Current user:", user);
    console.log("Only mine filter:", onlyMine);
  }, [user, onlyMine]);

  const limit = 3;
  const {
    initiatives,
    isLoadingMoreInitiatives,
    loadMoreInitiatives,
    hasMoreInitiatives,
  } = useInitiatives(user?.token, limit, onlyMine, setLoading);

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

  const navigateToActivities = (
    initiativeId: number,
    initiativeName: string,
  ) => {
    console.log(
      `Navigating to activities of initiative ${initiativeId} named ${initiativeName}`,
    );
    navigate(`/funds/${initiativeId}/${initiativeName}`, {
      state: { initiativeName },
    });
  };

  const toggleFilter = (filter: boolean) => {
    console.log("Toggling filter", filter);
    setOnlyMine(filter);
  };

  return (
    <div className={styles["container"]}>
      <div className={styles["side-panel"]} ref={sidePanelRef}>
        <TopNavigationBar
          title={`Initiatieven`}
          showSettings={false}
          showCta={false}
          onSettingsClick={() => {}}
          onCtaClick={() => {}}
          onSearch={() => {}}
          showSearch={false}
          showHomeLink={true}
          showTitleOnSmallScreen={false}
          hasPermission={false}
        />
        {user && (
          <div className={styles["filter-buttons"]}>
            <button
              className={
                !onlyMine ? styles["active-button"] : styles["filter-button"]
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
          {loading ? (
            <div className={styles["loading-container-small"]}>
              <LoadingDot delay={0} />
              <LoadingDot delay={0.1} />
              <LoadingDot delay={0.1} />
              <LoadingDot delay={0.2} />
              <LoadingDot delay={0.2} />
            </div>
          ) : (
            initiatives.map((initiative, index) => (
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
                    <span>
                      €{formatCurrency(Math.abs(initiative?.expenses))}
                    </span>
                  </div>
                  <div className={styles["shared-values"]}>
                    <label className={styles["value-income"]}>
                      Beschikbaar:
                    </label>
                    <span>€{formatCurrency(initiative?.beschikbaar ?? 0)}</span>
                  </div>
                </li>
                {initiative?.hidden && (
                  <span className={styles["hidden-label"]}>Verborgen</span>
                )}
              </div>
            ))
          )}
          {isLoadingMoreInitiatives && (
            <div className={styles["loading-container-small2"]}>
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
