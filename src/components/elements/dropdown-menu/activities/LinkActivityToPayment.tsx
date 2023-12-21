import React, { useEffect, useState } from "react";
import LoadingDot from "../../../animation/LoadingDot";
import Select from "react-dropdown-select";
import styles from "../../../../assets/scss/TransactionOverview.module.scss";
import {
  fetchLinkableActivities,
  linkActivityToPayment,
} from "../../../middleware/Api";

interface Activity {
  id: number | string;
  name: string;
}

interface LinkActivityToPaymentProps {
  token: string;
  paymentId: number;
  initiativeId: number | null;
  activityName: string;
  onActivityLinked: (transactionId: number, activityId: number | null) => void;
  linkedActivityId: number | null;
  isInitiativeLinked: boolean;
}

const LinkActivityToPayment: React.FC<LinkActivityToPaymentProps> = ({
  token,
  paymentId,
  initiativeId,
  activityName,
  onActivityLinked,
  linkedActivityId,
  isInitiativeLinked,
}) => {
  const [linkableActivities, setLinkableActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<
    number | string | null
  >(linkedActivityId !== null ? linkedActivityId : "");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSelectClicked, setIsSelectClicked] = useState<boolean>(false);

  const verbreekVerbindingOption: Activity = {
    id: -1,
    name: "Verbreek verbinding",
  };

  const handleSelectClick = () => {
    console.log("Dropdown clicked");
    setIsSelectClicked(true);
  };

  useEffect(() => {
    console.log("InitiativeId:", initiativeId);
    console.log("isSelectClicked:", isSelectClicked);

    if (isSelectClicked && initiativeId !== null) {
      console.log("Fetching linkable activities...");

      const getLinkableActivitiesForPayment = async () => {
        try {
          setIsLoading(true);
          const activities: Activity[] = await fetchLinkableActivities(
            token,
            initiativeId,
          );

          console.log("Fetched linkable activities:", activities);

          setLinkableActivities([verbreekVerbindingOption, ...activities]);

          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching linkable activities:", error);
          setIsLoading(false);
        }
      };

      getLinkableActivitiesForPayment();
    }
  }, [token, paymentId, initiativeId, isSelectClicked]);

  useEffect(() => {
    console.log("Selected Activity:", selectedActivity);
    if (selectedActivity !== "") {
      handleLinkActivity();
    }
  }, [selectedActivity]);

  const handleLinkActivity = async () => {
    try {
      setIsLoading(true);

      console.log("initiativeId before linking activity:", initiativeId);

      let valueToPass: number | null = null;

      if (selectedActivity !== "Geen") {
        if (typeof selectedActivity === "number") {
          valueToPass = selectedActivity;
        }
      }

      await linkActivityToPayment(
        token,
        paymentId,
        initiativeId === null ? null : initiativeId,
        valueToPass,
      );

      onActivityLinked(paymentId, valueToPass);
      setIsLoading(false);
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
      {!isInitiativeLinked ? (
        <div className={styles["disabled-dropdown"]}>
          <span className={styles["initiativeText"]}>Verbind activiteit</span>
        </div>
      ) : isLoading ? (
        <div className={styles["loading-column"]}>
          <div className={styles["loading-container"]}>
            <LoadingDot delay={0} />
            <LoadingDot delay={0.1} />
            <LoadingDot delay={0.1} />
            <LoadingDot delay={0.2} />
          </div>
        </div>
      ) : (
        <div className={styles["customContainer"]}>
          <div
            onClick={handleSelectClick}
            className="custom-dropdown-container"
          >
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
