import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TopNavigationBar from "../ui/top-navigation-bar/TopNavigationBar";
import styles from "../../assets/scss/Funds.module.scss";
import { usePermissions } from "../../contexts/PermissionContext";
import { useAuth } from "../../contexts/AuthContext";
import { fetchActivities } from "../middleware/Api";
import AddActivity from "../modals/AddActivity";
import LoadingDot from "../animation/LoadingDot";
import FundDetail from "./FundDetail";
import ActivityDetail from "./ActivityDetail";

interface Activities {
  id: number;
  name: string;
  budget: number;
  income: number;
  expenses: number;
  initiativeName: string;
  hidden: boolean;
}

export default function ActivitiesPage() {
  const navigate = useNavigate();

  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBlockingInteraction, setIsBlockingInteraction] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { fetchPermissions } = usePermissions();
  const [permissionsFetched, setPermissionsFetched] = useState(false);
  const [entityPermissions, setEntityPermissions] = useState<string[]>([]);
  const hasPermission = entityPermissions.includes("create_activity");
  const [activities, setActivities] = useState<Activities[]>([]);
  const [initiativeName, setInitiativeName] = useState("");
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActivitiesLoaded, setIsActivitiesLoaded] = useState(false);
  const { initiativeId, activityId } = useParams();
  const location = useLocation();
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    setIsLoading(true);

    if (!initiativeId) {
      setIsLoading(false);
      return;
    }

    fetchActivities(Number(initiativeId), user?.token ?? "")
      .then((initiativeData) => {
        const updatedActivities = initiativeData.activities || [];
        setInitiativeName(initiativeData.name);

        const activitiesWithInitiativeNames = updatedActivities.map(
          (activity) => ({
            ...activity,
            initiativeName: initiativeData.name,
          }),
        );
        setActivities(activitiesWithInitiativeNames);
        setIsLoading(false);
        setIsActivitiesLoaded(true);
      })
      .catch((error) => {
        console.error("Error fetching activities:", error);
        setIsLoading(false);
      });
  }, [initiativeId, user?.token, refreshTrigger]);

  useEffect(() => {
    if (activityId) {
      console.log("Setting selectedActivity on mount:", activityId);
      setSelectedActivity(activityId);
    }
  }, [activityId]);

  useEffect(() => {
    console.log("initiativeId:", initiativeId);
    console.log("activityId:", activityId);

    if (initiativeId) {
      if (user?.token && !permissionsFetched) {
        fetchPermissions("Initiative", parseInt(initiativeId), user.token)
          .then((permissions) => {
            setEntityPermissions(permissions || []);
            setPermissionsFetched(true);
          })
          .catch((error) => {
            console.error("Failed to fetch permissions:", error);
            setPermissionsFetched(true);
          });
      }
    }
  }, [user, fetchPermissions, permissionsFetched, initiativeId]);

  useEffect(() => {
    if (activityId) {
      setSelectedActivity(activityId);
    } else if (
      location.pathname.includes("/funds/") &&
      location.pathname.includes("/activities/")
    ) {
      const activityIdFromPath = location.pathname.split("/").pop();
      console.log(
        "Setting selectedActivity from location:",
        activityIdFromPath,
      );

      if (activityIdFromPath) {
        setSelectedActivity(activityIdFromPath);
      }
    }
  }, [activityId, location]);

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

  const handleSearch = (query) => {};

  const handleBackClick = () => {
    navigate("/funds");
  };

  const handleTitleClick = () => {
    setSelectedActivity(null);
    navigate(`/funds/${initiativeId}`);
  };

  const handleToggleAddActivityModal = () => {
    if (isModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsModalOpen(false);
        navigate(`/funds/${initiativeId}`);
      }, 300);
    } else {
      setIsModalOpen(true);
      navigate(`/funds/${initiativeId}/add-activity`);
    }
  };

  const handleActivityAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleActivityClick = (activityId) => {
    console.log("Setting selectedActivity:", activityId);
    setSelectedActivity(activityId);
    navigate(`/funds/${initiativeId}/activities/${activityId}`);
  };

  console.log("initiativeId before rendering detail:", initiativeId);
  console.log("selectedActivity before rendering detail:", selectedActivity);

  return (
    <div className={styles["container"]}>
      {!isMobile && (
        <div className={styles["side-panel"]}>
          <TopNavigationBar
            title={`Activiteiten`}
            subtitle={`${initiativeName}`}
            onTitleClick={handleTitleClick}
            showSettings={false}
            showCta={true}
            onBackArrowClick={handleBackClick}
            onSettingsClick={() => {}}
            onCtaClick={handleToggleAddActivityModal}
            onSearch={handleSearch}
            hasPermission={hasPermission}
            showSearch={false}
          />
          {isLoading ? (
            <div className={styles["loading-container"]}>
              <LoadingDot delay={0} />
              <LoadingDot delay={0.1} />
              <LoadingDot delay={0.1} />
              <LoadingDot delay={0.2} />
              <LoadingDot delay={0.2} />
            </div>
          ) : Array.isArray(activities) && activities.length === 0 ? (
            <p className={styles["no-activities"]}>
              Geen activiteiten gevonden
            </p>
          ) : (
            <ul className={styles["shared-unordered-list"]}>
              {activities.map((activity, index) => (
                <div
                  className={`${styles["shared-styling"]} ${styles["initiative-fade-in"]}`}
                  key={`${activity?.id}-${index}`}
                  style={{
                    animationDelay: `${index * 0.2}s`,
                  }}
                  onClick={() => handleActivityClick(activity.id)}
                >
                  <li className={styles["shared-name"]}>
                    <strong>{activity.name}</strong>
                  </li>
                  <div className={styles["values-bar"]}>
                    <div
                      key={`income-${activity.id}`}
                      className={styles["income-bar"]}
                      style={{
                        width: calculateBarWidth(
                          activity.income,
                          activity.expenses,
                        ).incomeWidth,
                      }}
                    ></div>
                    <div
                      key={`expenses-${activity.id}`}
                      className={styles["expenses-bar"]}
                      style={{
                        width: calculateBarWidth(
                          activity.income,
                          activity.expenses,
                        ).expensesWidth,
                      }}
                    ></div>
                  </div>
                  <li key={activity.id} className={styles["shared-list"]}>
                    <div className={styles["shared-values"]}>
                      <label>Begroting:</label>
                      <span>
                        €
                        {activity.budget.toLocaleString("nl-NL", {
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
                        {activity.income.toLocaleString("nl-NL", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className={styles["shared-values"]}>
                      <label className={styles["value-expenses"]}>
                        Besteed:
                      </label>
                      <span>
                        €
                        {activity.expenses.toLocaleString("nl-NL", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </li>
                  {activity?.hidden && (
                    <span className={styles["hidden-label"]}>Verborgen</span>
                  )}
                </div>
              ))}
            </ul>
          )}
        </div>
      )}

      <AddActivity
        isOpen={isModalOpen}
        onClose={handleToggleAddActivityModal}
        isBlockingInteraction={isBlockingInteraction}
        onActivityAdded={handleActivityAdded}
        refreshTrigger={refreshTrigger}
        initiativeId={Number(initiativeId)}
      />
      <div className={styles["detail-panel"]}>
        {selectedActivity !== null ? (
          <ActivityDetail
            activityId={selectedActivity}
            authToken={user?.token || ""}
            initiativeId={initiativeId || ""}
            onActivityEdited={() => {}}
          />
        ) : initiativeId !== null ? (
          <FundDetail
            initiativeId={initiativeId || ""}
            authToken={user?.token || ""}
            onFundEdited={() => {}}
          />
        ) : (
          <p>Select a fund or activity to view details.</p>
        )}
      </div>
    </div>
  );
}
