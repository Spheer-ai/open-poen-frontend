import React, { useState, useEffect } from "react";
import LoadingDot from "../../../animation/LoadingDot";
import Select from "react-dropdown-select";
import styles from "../../../../assets/scss/TransactionOverview.module.scss";
import {
  fetchLinkableActivities,
  linkActivityToPayment,
} from "../../../middleware/Api";

interface Activity {
  id: number;
  name: string;
}

interface LinkActivityToPaymentProps {
  token: string;
  paymentId: number;
  initiativeId: number;
  activityName: string;
}

const LinkActivityToPayment: React.FC<LinkActivityToPaymentProps> = ({
  token,
  paymentId,
  initiativeId,
  activityName,
}) => {
  const [linkableActivities, setLinkableActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<number | "">("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getLinkableActivitiesForPayment = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching activities with token:", token);
        console.log("Payment ID:", paymentId);
        console.log("Initiative ID:", initiativeId);

        const activities: Activity[] = await fetchLinkableActivities(
          token,
          initiativeId,
        );

        console.log("Activities:", activities);
        setLinkableActivities(activities);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching linkable activities:", error);
        setIsLoading(false);
      }
    };

    getLinkableActivitiesForPayment();
  }, [token, paymentId, initiativeId]);

  useEffect(() => {
    handleLinkActivity();
  }, []);

  const handleLinkActivity = async () => {
    try {
      setIsLoading(true);

      if (initiativeId !== null) {
        await linkActivityToPayment(
          token,
          paymentId,
          initiativeId,
          selectedActivity,
        );
        setIsLoading(false);
      } else {
        console.error("Initiative ID is not set. Cannot link activity.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error linking activity to payment:", error);
      setIsLoading(false);
    }
  };

  const mappedActivities = linkableActivities.map((activity) => ({
    value: activity.id,
    label: activity.name,
  }));

  return (
    <div className={styles["customDropdown"]}>
      {isLoading ? (
        <div className={styles["loading-container"]}>
          <LoadingDot delay={0} />
          <LoadingDot delay={0.1} />
          <LoadingDot delay={0.1} />
          <LoadingDot delay={0.2} />
        </div>
      ) : (
        <div className={styles["customContainer"]}>
          <div className="custom-dropdown-container">
            <Select
              values={
                selectedActivity === ""
                  ? []
                  : mappedActivities.filter(
                      (option) => option.value === selectedActivity,
                    )
              }
              options={mappedActivities}
              onChange={(values) =>
                setSelectedActivity(values[0] ? values[0].value : "")
              }
              labelField="label"
              valueField="value"
              placeholder={
                selectedActivity === ""
                  ? activityName || "Verbind activiteit"
                  : ""
              }
              className={styles["custom-option"]}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkActivityToPayment;
