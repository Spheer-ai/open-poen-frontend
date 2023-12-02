import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopNavigationBar from "../ui/top-navigation-bar/TopNavigationBar";
import styles from "../../assets/scss/Funds.module.scss";
import { usePermissions } from "../../contexts/PermissionContext";
import { useAuth } from "../../contexts/AuthContext";
import { fetchActivities } from "../middleware/Api";
import AddActivity from "../modals/AddActivity";
import LoadingDot from "../animation/LoadingDot";

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
          const updatedActivities = initiativeData.activities || [];

          setActivities(updatedActivities);
        })
        .catch((error) => {
          console.error("Error fetching activities:", error);
        });
    }
  }, [initiativeId, user, refreshTrigger]);

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
          title={`Activiteiten`}
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
          <p>Activiteiten worden geladen...</p>
        ) : (
          <ul className={styles["shared-unordered-list"]}>
            {activities.map((activity) => (
              <div className={styles["shared-styling"]} key={activity.id}>
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
                    <span>€{activity.budget}</span>
                  </div>
                  <div className={styles["shared-values"]}>
                    <label
                      className={
                        activity.income
                          ? styles["value-income"]
                          : styles["value-expenses"]
                      }
                    >
                      Beschikbaar:
                    </label>
                    <span>€{activity.income}</span>
                  </div>
                  <div className={styles["shared-values"]}>
                    <label
                      className={
                        activity.expenses
                          ? styles["value-expenses"]
                          : styles["value-income"]
                      }
                    >
                      Besteed:
                    </label>
                    <span>€{activity.expenses}</span>
                  </div>
                </li>
              </div>
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
        initiativeId={Number(initiativeId)}
      />
    </div>
  );
}
