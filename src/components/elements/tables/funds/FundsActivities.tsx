import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../../../assets/scss/Funds.module.scss";
import LoadingDot from "../../../animation/LoadingDot";
import { calculateBarWidth, formatCurrency } from "../../../utils/calculations";

interface Activities {
  id: number;
  name: string;
  budget: number;
  income: number;
  expenses: number;
  initiativeId: string;
}

const FundsActivities: React.FC<{
  activities: Activities[];
  isLoading: boolean;
  initiativeId: string;
}> = ({ activities, isLoading, initiativeId }) => {
  const navigate = useNavigate();

  const handleActivityClick = (activityId) => {
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
                  key={`besteed-${activity.id}`}
                  className={styles["expenses-bar"]}
                  style={{
                    width: calculateBarWidth(activity.budget, activity.expenses)
                      .spentWidth,
                  }}
                ></div>
                <div
                  key={`beschikbaar-${activity.id}`}
                  className={styles["income-bar"]}
                  style={{
                    width: calculateBarWidth(activity.budget, activity.expenses)
                      .availableWidth,
                  }}
                ></div>
              </div>
              <li key={activity.id} className={styles["shared-list"]}>
                <div className={styles["shared-values"]}>
                  <label>Toegekend:</label>
                  <span>€{formatCurrency(activity.budget)}</span>
                </div>
                <div className={styles["shared-values"]}>
                  <label className={styles["value-expenses"]}>Besteed:</label>
                  <span>€{formatCurrency(Math.abs(activity.expenses))}</span>
                </div>
                <div className={styles["shared-values"]}>
                  <label className={styles["value-income"]}>Beschikbaar:</label>
                  <span>
                    €{formatCurrency(activity.budget + activity.expenses)}
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
