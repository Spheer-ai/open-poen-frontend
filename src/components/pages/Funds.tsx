import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TopNavigationBar from "../ui/top-navigation-bar/TopNavigationBar";
import styles from "../../assets/scss/Funds.module.scss";
import AddFundDesktop from "../modals/AddFundDesktop";
import { usePermissions } from "../../contexts/PermissionContext";
import { useAuth } from "../../contexts/AuthContext";
import { fetchInitiatives } from "../middleware/Api";
import LoadingDot from "../animation/LoadingDot";

interface Initiative {
  id: number;
  name: string;
  budget: number;
  income: number;
  expenses: number;
}

export default function Funds() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { fetchPermissions } = usePermissions();
  const [entityPermissions, setEntityPermissions] = useState<string[]>([]);
  const hasPermission = useMemo(
    () => entityPermissions.includes("create"),
    [entityPermissions],
  );
  const [onlyMine, setOnlyMine] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(1);
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [isBlockingInteraction, setIsBlockingInteraction] = useState(false);
  const [isFetchingInitiatives, setIsFetchingInitiatives] = useState(false);
  const [allInitiatives, setAllInitiatives] = useState<Initiative[]>([]);
  const [myInitiatives, setMyInitiatives] = useState<Initiative[]>([]);
  const [displayedInitiativesCount, setDisplayedInitiativesCount] = useState(0);
  const [initialFetchDone, setInitialFetchDone] = useState(false);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(3);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalInitiatives, setTotalInitiatives] = useState(0);

  const [allFetchedInitiatives, setAllFetchedInitiatives] = useState<
    Initiative[]
  >([]);
  const [isLoadingMoreInitiatives, setIsLoadingMoreInitiatives] =
    useState(false);
  const [allInitiativesFetched, setAllInitiativesFetched] = useState(false);

  useEffect(() => {
    if (user?.token && entityPermissions.length === 0) {
      fetchPermissions("Funder", undefined, user.token)
        .then((permissions) => {
          console.log("Fetched permissions:", permissions);
          setEntityPermissions(permissions || []);
        })
        .catch((error) => {
          console.error("Failed to fetch permissions:", error);
        });
    }
  }, [user, entityPermissions, fetchPermissions]);

  useEffect(() => {
    if (
      user?.token &&
      entityPermissions.length > 0 &&
      (!initialFetchDone || refreshTrigger > 1)
    ) {
      console.log("useEffect triggered for initial fetch", {
        user,
        onlyMine,
        entityPermissions,
        initialFetchDone,
        offset,
        limit,
      });

      const cleanup = fetchAndDisplayInitiatives(
        user.token,
        onlyMine,
        0,
        limit,
      );
      setInitialFetchDone(true);
      return cleanup;
    }
  }, [
    user,
    onlyMine,
    refreshTrigger,
    entityPermissions,
    initialFetchDone,
    limit,
  ]);

  const fetchAndDisplayInitiatives = useCallback(
    (token, onlyMine, offset, limit) => {
      console.log("fetchAndDisplayInitiatives called", {
        token,
        onlyMine,
        offset,
        limit,
      });
      if (offset === 0) {
        setIsFetchingInitiatives(true);
      } else {
        setIsLoadingMoreInitiatives(true);
      }

      fetchInitiatives(token, onlyMine, offset, limit)
        .then((initiativesData: Initiative[]) => {
          console.log("Fetched initiatives:", initiativesData);

          setAllFetchedInitiatives((prevInitiatives) => [
            ...prevInitiatives,
            ...initiativesData,
          ]);

          if (onlyMine) {
            setMyInitiatives((prevMyInitiatives) => [
              ...prevMyInitiatives,
              ...initiativesData,
            ]);
          } else {
            setAllInitiatives((prevAllInitiatives) => [
              ...prevAllInitiatives,
              ...initiativesData,
            ]);
          }

          if (allFetchedInitiatives.length >= totalInitiatives) {
            setAllInitiativesFetched(true);
          }

          const count = initiativesData.length;
          let currentIndex = 0;
          const interval = setInterval(() => {
            if (currentIndex < count) {
              setDisplayedInitiativesCount(currentIndex + 1);
              currentIndex++;
            } else {
              clearInterval(interval);
            }
          }, 50);

          setIsFetchingInitiatives(false);
          setIsLoadingMoreInitiatives(false);
        })
        .catch((error) => {
          console.error("Error fetching initiatives:", error);
          setIsFetchingInitiatives(false);
          setIsLoadingMoreInitiatives(false);
        });
    },
    [refreshTrigger],
  );

  const handleLoadMoreClick = () => {
    const newOffset = offset + limit;
    console.log("Current Offset:", offset);
    console.log("Current Limit:", limit);
    console.log("New Offset:", newOffset);
    setOffset(newOffset);

    console.log("Fetching more initiatives...");
    fetchAndDisplayInitiatives(user?.token, onlyMine, newOffset, limit);
  };

  const handleSearch = (query) => {
    console.log("Search query in UserDetailsPage:", query);
  };

  const handleToggleAddFundModal = () => {
    if (isModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsModalOpen(!isModalOpen);
        navigate(`/funds`);
      }, 300);
    } else {
      setIsModalOpen(true);
      navigate(`/funds/add-fund`);
    }
  };

  const navigateToActivities = (initiativeId) => {
    navigate(`/funds/${initiativeId}/activities`);
  };

  const handleFundAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const calculateBarWidth = (income, expenses) => {
    const total = income + expenses;
    if (total === 0) {
      return {
        incomeWidth: "50%",
        expensesWidth: "50%",
      };
    }
    const incomeWidth = `${(income / total) * 100}%`;
    const expensesWidth = `${(expenses / total) * 100}%`;
    return {
      incomeWidth,
      expensesWidth,
    };
  };

  return (
    <div className={styles["container"]}>
      <div className={styles["side-panel"]}>
        <TopNavigationBar
          title={`Initiatieven`}
          showSettings={false}
          showCta={true}
          onSettingsClick={() => {}}
          onCtaClick={handleToggleAddFundModal}
          onSearch={handleSearch}
          hasPermission={hasPermission}
          showSearch={false}
        />
        <div className={styles["filter-buttons"]}>
          <button
            className={
              !onlyMine ? styles["active-button"] : styles["filter-button"]
            }
            onClick={() => {
              setOnlyMine(false);
              setOffset(0);
              setLimit(3);
            }}
          >
            Alle Initiatieven
          </button>
          <button
            className={
              onlyMine ? styles["active-button"] : styles["filter-button"]
            }
            onClick={() => {
              setOnlyMine(true);
              setOffset(0);
              setLimit(3);
              setRefreshTrigger((prevTrigger) => prevTrigger + 1);
            }}
          >
            Mijn Initiatieven
          </button>
        </div>
        {isFetchingInitiatives && offset === 0 && (
          <div className={styles["loading-container"]}>
            <LoadingDot delay={0} />
            <LoadingDot delay={0.1} />
            <LoadingDot delay={0.1} />
            <LoadingDot delay={0.2} />
            <LoadingDot delay={0.2} />
          </div>
        )}
        <ul className={styles["shared-unordered-list"]}>
          {(onlyMine ? myInitiatives : allInitiatives).map(
            (initiative, index) => (
              <div
                className={`${styles["shared-styling"]} ${styles["initiative-fade-in"]}`}
                key={`${initiative?.id}-${index}`}
                style={{
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                <li className={styles["shared-name"]}>
                  <a onClick={() => navigateToActivities(initiative?.id)}>
                    <strong>{initiative?.name}</strong>
                  </a>
                </li>

                <div className={styles["values-bar"]}>
                  <div
                    key={`income-${initiative?.id}`}
                    className={styles["income-bar"]}
                    style={{
                      width: calculateBarWidth(
                        initiative?.income,
                        initiative?.expenses,
                      )?.incomeWidth,
                    }}
                  ></div>
                  <div
                    key={`expenses-${initiative?.id}`}
                    className={styles["expenses-bar"]}
                    style={{
                      width: calculateBarWidth(
                        initiative?.income,
                        initiative?.expenses,
                      )?.expensesWidth,
                    }}
                  ></div>
                </div>
                <li className={styles["shared-list"]}>
                  <div className={styles["shared-values"]}>
                    <label>Begroting:</label>
                    <span>€{initiative?.budget}</span>
                  </div>
                  <div className={styles["shared-values"]}>
                    <label
                      className={
                        initiative?.income
                          ? styles["value-income"]
                          : styles["value-expenses"]
                      }
                    >
                      Beschikbaar:
                    </label>
                    <span>€{initiative?.income}</span>
                  </div>
                  <div className={styles["shared-values"]}>
                    <label
                      className={
                        initiative?.expenses
                          ? styles["value-expenses"]
                          : styles["value-income"]
                      }
                    >
                      Besteed:
                    </label>
                    <span>€{initiative?.expenses}</span>
                  </div>
                </li>
              </div>
            ),
          )}
          {isLoadingMoreInitiatives ? (
            <div className={styles["loading-container-small"]}>
              <LoadingDot delay={0} />
              <LoadingDot delay={0.1} />
              <LoadingDot delay={0.1} />
              <LoadingDot delay={0.2} />
              <LoadingDot delay={0.2} />
            </div>
          ) : (
            <button onClick={handleLoadMoreClick}>Load more...</button>
          )}
        </ul>
      </div>
      <AddFundDesktop
        isOpen={isModalOpen}
        onClose={handleToggleAddFundModal}
        isBlockingInteraction={isBlockingInteraction}
        onFundAdded={handleFundAdded}
        funderId={0}
        regulationId={0}
      />
    </div>
  );
}
