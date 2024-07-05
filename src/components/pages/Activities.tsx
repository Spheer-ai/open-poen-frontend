import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TopNavigationBar from "../ui/top-navigation-bar/TopNavigationBar";
import styles from "../../assets/scss/Funds.module.scss";
import { useFetchEntityPermissions } from "../hooks/useFetchPermissions";
import { useAuth } from "../../contexts/AuthContext";
import AddActivity from "../modals/AddActivity";
import LoadingDot from "../animation/LoadingDot";
import FundDetail from "./FundDetail";
import ActivityDetail from "./ActivityDetail";
import { calculateBarWidth, formatCurrency } from "../utils/calculations";
import useActivities from "../hooks/useActivities";
import { Activities } from "../../types/ActivitiesTypes";

export default function ActivitiesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBlockingInteraction, setIsBlockingInteraction] = useState(false);
  const { fetchPermissions } = useFetchEntityPermissions();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [entityPermissions, setEntityPermissions] = useState<string[]>([]);
  const hasPermission = entityPermissions.includes("create_activity");
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { initiativeId, activityId } = useParams();
  const location = useLocation();
  const [arePermissionsLoading, setArePermissionsLoading] = useState(true);
  const isMobile = window.innerWidth <= 768;

  const {
    activities,
    initiativeName,
    isActivitiesLoaded,
    loadActivities,
    addActivityToList,
    initiativeData,
    updateActivityInList,
    removeActivityFromList,
  } = useActivities(Number(initiativeId), user?.token, setIsLoading);

  useEffect(() => {
    if (initiativeId && user?.token) {
      const loadPermissions = async () => {
        console.log("Fetching permissions for initiativeId:", initiativeId);
        console.log("User token:", user.token);

        try {
          const permissions = await fetchPermissions(
            "Initiative",
            Number(initiativeId),
            user?.token,
          );
          console.log("Fetched permissions:", permissions);

          setEntityPermissions(permissions || []);
        } catch (error) {
          console.error("Failed to fetch permissions:", error);
        } finally {
          setArePermissionsLoading(false);
        }
      };

      loadPermissions();
    } else {
      setArePermissionsLoading(false);
    }
  }, [initiativeId, user?.token, fetchPermissions]);

  useEffect(() => {
    if (!arePermissionsLoading && !isActivitiesLoaded) {
      loadActivities();
    }
  }, [arePermissionsLoading, isActivitiesLoaded, loadActivities]);

  useEffect(() => {
    if (activityId) {
      setSelectedActivity(activityId);
    } else if (
      location.pathname.includes("/funds/") &&
      location.pathname.includes("/activities/")
    ) {
      const activityIdFromPath = location.pathname.split("/").pop();
      if (activityIdFromPath) {
        setSelectedActivity(activityIdFromPath);
      }
    }
  }, [activityId, location.pathname]);

  useEffect(() => {
    if (refreshTrigger > 0) {
      loadActivities();
    }
  }, [refreshTrigger, loadActivities]);

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

  const handleActivityAdded = (newActivity: Activities) => {
    addActivityToList(newActivity);
  };

  const handleActivityEdited = (updatedActivity: Activities) => {
    console.log("handleActivityEdited called with:", updatedActivity);
    updateActivityInList(updatedActivity);
  };

  const handleActivityClick = (activityId: string) => {
    setSelectedActivity(activityId);
    navigate(`/funds/${initiativeId}/activities/${activityId}`);
  };

  const handleActivityDeleted = (activityId: string) => {
    console.log("Activity deleted, navigating to fund detail");
    setSelectedActivity(null);
    removeActivityFromList(activityId);
    navigate(`/funds/${initiativeId}`);
  };

  const handleFundEdited = () => {
    setRefreshTrigger((prev) => prev + 1);
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
          onSearch={() => {}}
          hasPermission={hasPermission}
          showSearch={false}
          showHomeLink={false}
          showTitleOnSmallScreen={true}
        />
        {!isMobile && (
          <>
            {isLoading || arePermissionsLoading ? (
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
                    onClick={() => handleActivityClick(activity.id.toString())}
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
                        <span>€{formatCurrency(activity.budget)}</span>
                      </div>
                      <div className={styles["shared-values"]}>
                        <label className={styles["value-expenses"]}>
                          Besteed:
                        </label>
                        <span>
                          €{formatCurrency(Math.abs(activity.expenses))}
                        </span>
                      </div>
                      <div className={styles["shared-values"]}>
                        <label className={styles["value-income"]}>
                          Beschikbaar:
                        </label>
                        <span>
                          €
                          {formatCurrency(
                            Math.max(activity.budget + activity.expenses, 0),
                          )}
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
        initiativeId={Number(initiativeId)}
      />
      <div className={styles["detail-panel"]}>
        {selectedActivity !== null ? (
          <ActivityDetail
            activityId={selectedActivity}
            authToken={user?.token || ""}
            initiativeId={initiativeId || ""}
            onActivityEdited={handleActivityEdited}
            onActivityDeleted={handleActivityDeleted}
            entityPermissions={entityPermissions}
            initiativeData={initiativeData}
          />
        ) : initiativeId !== null ? (
          <FundDetail
            initiativeId={initiativeId || ""}
            authToken={user?.token || ""}
            initiativeData={initiativeData}
            onFundEdited={handleFundEdited}
            entityPermissions={entityPermissions}
            activities={activities}
            isLoading={isLoading}
          />
        ) : (
          <p>Select a fund or activity to view details.</p>
        )}
      </div>
    </div>
  );
}
