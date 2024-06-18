import React, { useEffect, useState, useCallback, useRef } from "react";
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
  beschikbaar?: number;
}

export default function ActivitiesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBlockingInteraction, setIsBlockingInteraction] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { fetchPermissions } = usePermissions();
  const [permissionsFetched, setPermissionsFetched] = useState(false);
  const permissionsRef = useRef(false);
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

  const loadActivities = useCallback(async () => {
    setIsLoading(true);

    if (!initiativeId) {
      setIsLoading(false);
      return;
    }

    console.log("Fetching activities for initiativeId:", initiativeId);

    try {
      const initiativeData = await fetchActivities(
        Number(initiativeId),
        user?.token ?? "",
      );
      console.log("Fetched initiative data:", initiativeData);

      const updatedActivities = initiativeData.activities || [];
      setInitiativeName(initiativeData.name);

      const activitiesWithInitiativeNames = updatedActivities.map(
        (activity) => ({
          ...activity,
          initiativeName: initiativeData.name,
          beschikbaar: Math.max(activity.budget + activity.expenses, 0),
        }),
      );
      console.log(
        "Updated activities with initiative names:",
        activitiesWithInitiativeNames,
      );

      setActivities(activitiesWithInitiativeNames);
      setIsLoading(false);
      setIsActivitiesLoaded(true);
    } catch (error) {
      console.error("Error fetching activities:", error);
      setIsLoading(false);
    }
  }, [initiativeId, user?.token]);

  useEffect(() => {
    console.log("useEffect for loading activities triggered");
    loadActivities();
  }, [loadActivities, refreshTrigger]);

  useEffect(() => {
    if (
      isActivitiesLoaded &&
      initiativeId &&
      user?.token &&
      !permissionsRef.current
    ) {
      const loadPermissions = async () => {
        console.log("Fetching permissions for initiativeId:", initiativeId);

        try {
          const permissions = await fetchPermissions(
            "Initiative",
            parseInt(initiativeId),
            user.token,
          );
          console.log("Fetched permissions:", permissions);

          setEntityPermissions(permissions || []);
          setPermissionsFetched(true);
          permissionsRef.current = true;
        } catch (error) {
          console.error("Failed to fetch permissions:", error);
          setPermissionsFetched(true);
        }
      };

      loadPermissions();
    }
  }, [isActivitiesLoaded, initiativeId, user?.token, fetchPermissions]);

  useEffect(() => {
    if (activityId) {
      console.log("Setting selectedActivity:", activityId);
      setSelectedActivity(activityId);
    } else if (
      location.pathname.includes("/funds/") &&
      location.pathname.includes("/activities/")
    ) {
      const activityIdFromPath = location.pathname.split("/").pop();

      if (activityIdFromPath) {
        console.log("Setting selectedActivity from path:", activityIdFromPath);
        setSelectedActivity(activityIdFromPath);
      }
    }
  }, [activityId, location.pathname]);

  const calculateBarWidth = (budget, expenses) => {
    const available = Math.max(budget + expenses, 0);
    const spent = Math.abs(expenses);
    const total = available + spent;

    if (total === 0) {
      return {
        availableWidth: "50%",
        spentWidth: "50%",
      };
    }

    const availableWidth = `${(available / total) * 100}%`;
    const spentWidth = `${(spent / total) * 100}%`;

    return {
      availableWidth,
      spentWidth,
    };
  };

  const handleSearch = (query) => {
    console.log("Search query:", query);
  };

  const handleBackClick = () => {
    console.log("Back button clicked");
    navigate("/funds");
  };

  const handleTitleClick = () => {
    console.log("Title clicked");
    setSelectedActivity(null);
    navigate(`/funds/${initiativeId}`);
  };

  const handleToggleAddActivityModal = () => {
    console.log("Toggling add activity modal, isModalOpen:", isModalOpen);

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
    console.log("Activity added");
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleActivityEdited = () => {
    console.log("Activity edited");
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleActivityClick = (activityId) => {
    console.log("Activity clicked:", activityId);
    setSelectedActivity(activityId);
    navigate(`/funds/${initiativeId}/activities/${activityId}`);
  };

  return (
    <div className={styles["container"]}>
      <div className={styles["side-panel"]} style={{ height: "auto" }}>
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
          showHomeLink={false}
          showTitleOnSmallScreen={true}
        />
        {!isMobile && (
          <>
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
              <ul
                className={`${styles["shared-unordered-list"]} ${styles["activity-list"]}`}
              >
                {activities.map((activity, index) => (
                  <div
                    className={`${styles["shared-styling"]} ${styles["initiative-fade-in"]}`}
                    key={`${activity?.id}-${index}`}
                    style={{ animationDelay: `${index * 0.2}s` }}
                    onClick={() => handleActivityClick(activity.id)}
                  >
                    <li className={styles["shared-name"]}>
                      <strong>{activity.name}</strong>
                    </li>
                    <div className={styles["values-bar"]}>
                      <div
                        key={`besteed-${activity.id}`}
                        className={styles["expenses-bar"]}
                        style={{
                          width: calculateBarWidth(
                            activity.budget,
                            activity.expenses,
                          ).spentWidth,
                        }}
                      ></div>
                      <div
                        key={`beschikbaar-${activity.id}`}
                        className={styles["income-bar"]}
                        style={{
                          width: calculateBarWidth(
                            activity.budget,
                            activity.expenses,
                          ).availableWidth,
                        }}
                      ></div>
                    </div>
                    <li key={activity.id} className={styles["shared-list"]}>
                      <div className={styles["shared-values"]}>
                        <label>Toegekend:</label>
                        <span>
                          €
                          {activity.budget.toLocaleString("nl-NL", {
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
                          {Math.abs(activity.expenses).toLocaleString("nl-NL", {
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
                          {Math.max(
                            activity.budget + activity.expenses,
                            0,
                          ).toLocaleString("nl-NL", {
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
          </>
        )}
      </div>
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
            onActivityEdited={handleActivityEdited}
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
