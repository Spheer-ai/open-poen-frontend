import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopNavigationBar from "../ui/top-navigation-bar/TopNavigationBar";
import styles from "../../assets/scss/Funds.module.scss";
import { usePermissions } from "../../contexts/PermissionContext";
import { useAuth } from "../../contexts/AuthContext";
import { fetchActivities } from "../middleware/Api";
import AddActivity from "../modals/AddActivity";

interface Activities {
  id: number;
  name: string;
  budget: number;
  income: number;
  expenses: number;
}

export default function ActivitiesPage() {
  const navigate = useNavigate();
  const { action } = useParams();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBlockingInteraction, setIsBlockingInteraction] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { fetchPermissions } = usePermissions();
  const [permissionsFetched, setPermissionsFetched] = useState(false);
  const [entityPermissions, setEntityPermissions] = useState<string[]>([]);
  const hasPermission = entityPermissions.includes("create_activity");
  const [activities, setActivities] = useState<Activities[]>([]);
  const initiativeId = useParams()?.initiativeId || "";

  useEffect(() => {
    console.log("action:", action);
    if (!initiativeId) {
      console.error("initiativeId is not defined.");
      return;
    }

    if (user?.token && !permissionsFetched) {
      fetchPermissions("Initiative", parseInt(initiativeId), user.token)
        .then((permissions) => {
          console.log("Fetched permissions:", permissions);
          setEntityPermissions(permissions || []);
          setPermissionsFetched(true);
        })
        .catch((error) => {
          console.error("Failed to fetch permissions:", error);
          setPermissionsFetched(true);
        });
    } else {
      console.log("Token is not available or permissions are already fetched.");
    }
  }, [
    action,
    user,
    fetchPermissions,
    permissionsFetched,
    initiativeId,
    refreshTrigger,
  ]);

  useEffect(() => {
    if (initiativeId && user?.token) {
      fetchActivities(Number(initiativeId), user.token)
        .then((initiativeData) => {
          console.log("Fetched activities:", initiativeData.activities);
          setActivities(initiativeData.activities || []);
        })
        .catch((error) => {
          console.error("Error fetching initiatives:", error);
        });
    }
  }, [initiativeId, user, refreshTrigger]);

  const handleSearch = (query) => {
    console.log("Search query in UserDetailsPage:", query);
  };

  const handleBackClick = () => {
    navigate("/funds");
  };

  const handleToggleAddActivityModal = () => {
    if (isModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsModalOpen(false);
        navigate(`/funds/${initiativeId}/activities`);
      }, 300);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleActivityAdded = () => {
    console.log("Activity added. Refreshing activities list...");
    setRefreshTrigger((prev) => prev + 1);
  };

  console.log("initiativeId:", initiativeId);

  return (
    <div className={styles["container"]}>
      <div className={styles["side-panel"]}>
        <TopNavigationBar
          title="Activiteiten"
          showSettings={false}
          showCta={true}
          onBackArrowClick={handleBackClick}
          onSettingsClick={() => {}}
          onCtaClick={handleToggleAddActivityModal}
          onSearch={handleSearch}
          hasPermission={hasPermission}
          showSearch={false}
        />
        {Array.isArray(activities) && activities.length === 0 ? (
          <p>Geen resultaten gevonden</p>
        ) : (
          <ul>
            {activities.map((activity) => (
              <li key={activity.id}>
                <strong>{activity.name}</strong>
                <br />
                Budget: €{activity.budget}
                <br />
                Income: €{activity.income}
                <br />
                Expenses: €{activity.expenses}
              </li>
            ))}
          </ul>
        )}
      </div>
      <AddActivity
        isOpen={isModalOpen}
        onClose={handleToggleAddActivityModal}
        isBlockingInteraction={isBlockingInteraction}
        onActivityAdded={handleActivityAdded}
        refreshTrigger={refreshTrigger}
      />
    </div>
  );
}
