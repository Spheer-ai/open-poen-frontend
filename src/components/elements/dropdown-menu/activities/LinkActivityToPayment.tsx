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
  >(linkedActivityId !== null ? linkedActivityId : null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSelectClicked, setIsSelectClicked] = useState<boolean>(false);

  const verbreekVerbindingOption: Activity = {
    id: -1,
    name: "Verbreek verbinding",
  };

  useEffect(() => {
    if (isInitiativeLinked && initiativeId !== null) {
      setIsSelectClicked(true);
    }
  }, [isInitiativeLinked, initiativeId]);

  const handleSelectClick = () => {
    setIsSelectClicked(true);
    console.log("Initiative ID when dropdown is clicked:", initiativeId);
  };

  useEffect(() => {
    if (isSelectClicked) {
      const getLinkableActivitiesForPayment = async () => {
        try {
          setIsLoading(true);
          const activities: Activity[] = await fetchLinkableActivities(
            token,
            initiativeId,
          );

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
    if (selectedActivity !== null) {
      handleLinkActivity();
    }
  }, [selectedActivity]);

  const handleLinkActivity = async () => {
    try {
      console.log("Linking activity to payment...");
      setIsLoading(true);

      let valueToPass: number | null = null;

      if (
        selectedActivity !== null &&
        selectedActivity !== verbreekVerbindingOption.id
      ) {
        if (typeof selectedActivity === "number") {
          valueToPass = selectedActivity;
        }
      }

      console.log("Linking with value:", valueToPass);

      await linkActivityToPayment(token, paymentId, initiativeId, valueToPass);

      console.log("Linking successful!");
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
      <div className={styles["customContainer"]}>
        <div onClick={handleSelectClick} className="custom-dropdown-container">
          <Select
            values={
              selectedActivity !== null
                ? mappedActivities.filter(
                    (option) => option.value === selectedActivity,
                  )
                : []
            }
            options={mappedActivities}
            onChange={(values) =>
              setSelectedActivity(values.length > 0 ? values[0].value : null)
            }
            labelField="label"
            valueField="value"
            placeholder={
              selectedActivity !== null
                ? ""
                : activityName || "Verbind activiteit"
            }
            className={styles["custom-option"]}
          />
        </div>
      </div>
      {isLoading && (
        <div className={styles["loading-column"]}>
          <div className={styles["loading-container"]}>
            <LoadingDot delay={0} />
            <LoadingDot delay={0.1} />
            <LoadingDot delay={0.1} />
            <LoadingDot delay={0.2} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkActivityToPayment;
