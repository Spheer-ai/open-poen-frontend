import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../../../../assets/scss/Funds.module.scss";
import { useAuth } from "../../../../contexts/AuthContext";
import { fetchActivities } from "../../../middleware/Api";

interface Activities {
  id: number;
  name: string;
  budget: number;
  income: number;
  expenses: number;
  initiativeId: string;
  token: string;
}

const FundsActivities: React.FC<{
  authToken: string;
  initiativeId: string;
}> = ({ authToken }) => {
  const { user } = useAuth();

  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activities[]>([]);
  const initiativeId = useParams()?.initiativeId || "";
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  useEffect(() => {
    if (initiativeId) {
      const fetchActivitiesData = async () => {
        try {
          const result = await fetchActivities(
            Number(initiativeId),
            user?.token || "",
          );
          console.log("Fetched activities:", result.activities);
          const updatedActivities = result.activities || [];
          setActivities(updatedActivities);
        } catch (error) {
          console.error("Error fetching activities:", error);
        }
      };

      fetchActivitiesData();
    }
  }, [initiativeId, user]);

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

  const handleActivityClick = (activityId) => {
    console.log("Clicked activity ID:", activityId);
    setSelectedActivity(activityId);
    navigate(`/funds/${initiativeId}/activities/${activityId}`);
  };

  return (
    <div className={styles["shared-container"]}>
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
                  width: calculateBarWidth(activity.income, activity.expenses)
                    .incomeWidth,
                }}
              ></div>
              <div
                key={`expenses-${activity.id}`}
                className={styles["expenses-bar"]}
                style={{
                  width: calculateBarWidth(activity.income, activity.expenses)
                    .expensesWidth,
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
    </div>
  );
};

export default FundsActivities;
