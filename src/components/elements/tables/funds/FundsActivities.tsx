import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../../../../assets/scss/Funds.module.scss";
import { useAuth } from "../../../../contexts/AuthContext";
import LoadingDot from "../../../animation/LoadingDot";
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
  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState<Activities[]>([]);
  const [error, setError] = useState<string | null>(null);
  const initiativeId = useParams()?.initiativeId || "";
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  useEffect(() => {
    if (initiativeId) {
      const fetchActivitiesData = async () => {
        try {
          setIsLoading(true);
          setError(null);
          const result = await fetchActivities(
            Number(initiativeId),
            user?.token || "",
          );
          const updatedActivities = result.activities || [];
          setActivities(updatedActivities);
        } catch (error) {
          console.error("Error fetching activities:", error);
          setError("Error fetching activities.");
        } finally {
          setIsLoading(false);
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
    setSelectedActivity(activityId);
    navigate(`/funds/${initiativeId}/activities/${activityId}`);
  };

  return (
    <div className={styles["shared-container"]}>
      {isLoading && (
        <div className={styles["loading-container"]}>
          <div className={styles["loading-dots"]}>
            <LoadingDot delay={0} />
            <LoadingDot delay={0.1} />
            <LoadingDot delay={0.1} />
            <LoadingDot delay={0.2} />
            <LoadingDot delay={0.2} />
          </div>
        </div>
      )}
      {!isLoading && activities.length === 0 && (
        <p>Geen activiteiten gevonden</p>
      )}
      {!isLoading && activities.length > 0 && (
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
                  <span>
                    €
                    {Math.abs(activity.expenses).toLocaleString("nl-NL", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </li>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FundsActivities;
