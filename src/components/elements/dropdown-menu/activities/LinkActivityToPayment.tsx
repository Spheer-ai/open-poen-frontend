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
  linkingStatus: Record<
    number,
    { initiativeId: number | null; activityId: number | null }
  >;
}

const LinkActivityToPayment: React.FC<LinkActivityToPaymentProps> = ({
  token,
  paymentId,
  initiativeId,
  activityName,
  onActivityLinked,
  linkedActivityId,
  isInitiativeLinked,
  linkingStatus,
}) => {
  const [linkableActivities, setLinkableActivities] = useState<Activity[]>(
    linkedActivityId !== null
      ? [{ id: linkedActivityId, name: activityName }]
      : [],
  );

  const [selectedActivity, setSelectedActivity] = useState<
    number | string | null
  >(linkedActivityId !== null ? linkedActivityId : null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSelectClicked, setIsSelectClicked] = useState<boolean>(false);
  const [noDataLabel, setNoDataLabel] = useState<string>("");
  const [isLinking, setIsLinking] = useState<boolean>(false);

  const verbreekVerbindingOption: Activity = {
    id: -1,
    name: "Verbreek verbinding",
  };

  useEffect(() => {
    if (isInitiativeLinked && initiativeId !== null) {
    }
  }, [isInitiativeLinked, initiativeId]);

  const handleSelectClick = () => {
    setIsSelectClicked(true);
    setNoDataLabel("Gegevens ophalen");
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
      setIsLinking(true);
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

      await linkActivityToPayment(token, paymentId, initiativeId, valueToPass);

      onActivityLinked(paymentId, valueToPass);
      setIsLoading(false);
      setIsLinking(false);
    } catch (error) {
      console.error("Error linking activity to payment:", error);
      setIsLoading(false);
      setIsLinking(false);
    }
  };

  const mappedActivities = linkableActivities.map((activity) => ({
    value: activity.id,
    label: activity.name,
  }));

  return (
    <div className={styles["customDropdown"]}>
      <div className={styles["customContainer"]}>
        {linkingStatus[paymentId]?.initiativeId === null ? (
          <div className={styles["disabled-dropdown"]}>
            <span className={styles["initiativeText"]}>
              {" "}
              {"Verbind activiteit"}
            </span>
          </div>
        ) : (
          <div
            onClick={handleSelectClick}
            className="custom-dropdown-container"
          >
            {isLinking ? (
              <div className={styles["loading-column"]}>
                <div className={styles["loading-container"]}>
                  <LoadingDot delay={0} />
                  <LoadingDot delay={0.1} />
                  <LoadingDot delay={0.1} />
                  <LoadingDot delay={0.2} />
                </div>
              </div>
            ) : (
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
                  setSelectedActivity(
                    values.length > 0 ? values[0].value : null,
                  )
                }
                labelField="label"
                valueField="value"
                placeholder={
                  selectedActivity !== null
                    ? ""
                    : activityName || "Verbind activiteit"
                }
                className={styles["custom-option"]}
                noDataLabel={isLoading ? "Gegevens ophalen" : ""}
              />
            )}
          </div>
        )}
      </div>
      {isLoading && !isLinking && (
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
