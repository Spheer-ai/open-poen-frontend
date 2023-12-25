import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import TopNavigationBar from "../ui/top-navigation-bar/TopNavigationBar";
import styles from "../../assets/scss/Funds.module.scss";
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
  const { fetchPermissions } = usePermissions();
  const [entityPermissions, setEntityPermissions] = useState<string[]>([]);
  const hasPermission = useMemo(
    () => entityPermissions.includes("create"),
    [entityPermissions],
  );
  const [onlyMine, setOnlyMine] = useState(false);
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [isFetchingInitiatives, setIsFetchingInitiatives] = useState(false);
  const [allInitiatives, setAllInitiatives] = useState<Initiative[]>([]);
  const [myInitiatives, setMyInitiatives] = useState<Initiative[]>([]);
  const [displayedInitiativesCount, setDisplayedInitiativesCount] = useState(0);
  const [initialFetchDone, setInitialFetchDone] = useState(false);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);
  const [totalInitiatives, setTotalInitiatives] = useState(0);

  const [allFetchedInitiatives, setAllFetchedInitiatives] = useState<
    Initiative[]
  >([]);
  const [isLoadingMoreInitiatives, setIsLoadingMoreInitiatives] =
    useState(false);
  const [allInitiativesFetched, setAllInitiativesFetched] = useState(false);
  const initialFetchDoneRef = useRef(false);

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
  }, [user, entityPermissions]);

  useEffect(() => {
    if (!initialFetchDoneRef.current) {
      console.log("useEffect triggered for initial fetch", {
        user,
        onlyMine,
        entityPermissions,
        initialFetchDone,
        offset,
        limit,
      });

      const cleanup = fetchAndDisplayInitiatives(
        user?.token,
        onlyMine,
        0,
        limit,
      );
      initialFetchDoneRef.current = true;
      return cleanup;
    }
  }, [user?.token, onlyMine, entityPermissions, offset, limit]);

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

      const apiToken = user?.token || "";

      fetchInitiatives(apiToken, onlyMine, offset, limit)
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
    [user, limit],
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

  const navigateToActivities = (initiativeId) => {
    navigate(`/funds/${initiativeId}/activities`);
  };

  const calculateBarWidth = (income, expenses) => {
    const total = Math.abs(income) + Math.abs(expenses);
    if (total === 0) {
      return {
        incomeWidth: "50%",
        expensesWidth: "50%",
      };
    }
    const incomeWidth = `${(Math.abs(income) / total) * 100}%`;
    const expensesWidth = `${(Math.abs(expenses) / total) * 100}%`;
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
          showCta={false}
          onSettingsClick={() => {}}
          onCtaClick={() => {}}
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
              setLimit(20);
              setIsFetchingInitiatives(true);
              setInitiatives([]);
              setAllInitiatives([]);
              setMyInitiatives([]);
              fetchAndDisplayInitiatives(user?.token, false, 0, 20);
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
              setIsFetchingInitiatives(true);
              setInitiatives([]);
              setAllInitiatives([]);
              setMyInitiatives([]);
              fetchAndDisplayInitiatives(user?.token, true, 0, 20);
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
                  animationDelay: `${index * 0.1}s`,
                }}
                onClick={() => navigateToActivities(initiative?.id)}
              >
                <li className={styles["shared-name"]}>
                  <strong>{initiative?.name}</strong>
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
            <button onClick={handleLoadMoreClick}>
              Meer initiatieven laden..
            </button>
          )}
        </ul>
      </div>
    </div>
  );
}
