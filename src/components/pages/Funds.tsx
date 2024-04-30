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
  hidden: boolean;
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

  const [isAtBottom, setIsAtBottom] = useState(false);
  const sidePanelRef = useRef<HTMLDivElement | null>(null);

  const checkBottom = () => {
    const sidePanel = sidePanelRef.current;

    if (sidePanel) {
      const scrollY = sidePanel.scrollTop;
      const panelHeight = sidePanel.clientHeight;
      const contentHeight = sidePanel.scrollHeight;

      const threshold = 50;

      setIsAtBottom(contentHeight - (scrollY + panelHeight) < threshold);
    }
  };

  useEffect(() => {
    if (user?.token) {
      if (entityPermissions.length === 0) {
        fetchPermissions("Funder", undefined, user.token)
          .then((permissions) => {
            setEntityPermissions(permissions || []);
          })
          .catch((error) => {
            console.error("Failed to fetch permissions:", error);
          });
      }
    }
  }, [user]);

  useEffect(() => {
    if (!initialFetchDoneRef.current) {
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
      if (offset === 0) {
        setIsFetchingInitiatives(true);
      } else {
        setIsLoadingMoreInitiatives(true);
      }

      const apiToken = user?.token || "";

      fetchInitiatives(apiToken, onlyMine, offset, limit)
        .then((initiativesData: Initiative[]) => {
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
    setOffset(newOffset);
    fetchAndDisplayInitiatives(user?.token, onlyMine, newOffset, limit);
  };

  useEffect(() => {
    const sidePanel = sidePanelRef.current;

    if (sidePanel) {
      sidePanel.addEventListener("scroll", checkBottom);

      return () => {
        sidePanel.removeEventListener("scroll", checkBottom);
      };
    }
  }, []);

  useEffect(() => {
    if (isAtBottom) {
      handleLoadMoreClick();
    }
  }, [isAtBottom]);

  const handleSearch = (query) => {};

  const navigateToActivities = (initiativeId, initiativeName) => {
    navigate(`/funds/${initiativeId}/${initiativeName}`, {
      state: { initiativeName },
    });
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
                setLimit(20);
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
        )}
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
                onClick={() =>
                  navigateToActivities(initiative?.id, initiative?.name)
                }
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
                    <span>
                      €
                      {initiative?.budget.toLocaleString("nl-NL", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className={styles["shared-values"]}>
                    <label className={styles["value-income"]}>
                      Beschikbaar:
                    </label>
                    <span>
                      €
                      {initiative?.income.toLocaleString("nl-NL", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className={styles["shared-values"]}>
                    <label className={styles["value-expenses"]}>Besteed:</label>
                    <span>
                      €
                      {Math.abs(initiative?.expenses).toLocaleString("nl-NL", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </li>
                {initiative?.hidden && (
                  <span className={styles["hidden-label"]}>Verborgen</span>
                )}
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
            <></>
          )}
        </ul>
      </div>
    </div>
  );
}
