import React, { useEffect, useState } from "react";
import LoadingDot from "../../../animation/LoadingDot";
import Select from "react-select";
import styles from "../../../../assets/scss/TransactionOverview.module.scss";
import {
  fetchLinkableActivities,
  linkActivityToPayment,
} from "../../../middleware/Api";

interface Activity {
  id: number | string;
  name: string;
}

interface LinkInitiativePaymentToActivityProps {
  token?: string;
  paymentId: number | null;
  initiativeId: number | null;
  linkedActivityId: number | null;
  activityName: string;
  isInitiativeLinked: boolean;
}

const LinkInitiativePaymentToActivity: React.FC<
  LinkInitiativePaymentToActivityProps
> = ({ paymentId, initiativeId, linkedActivityId, token, activityName }) => {
  const [selectedActivity, setSelectedActivity] = useState<
    number | string | null
  >(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSelectClicked, setIsSelectClicked] = useState<boolean>(false);
  const [isLinking, setIsLinking] = useState<boolean>(false);
  const [linkableActivities, setLinkableActivities] = useState<Activity[]>(
    linkedActivityId !== null
      ? [{ id: linkedActivityId, name: activityName }]
      : [],
  );
  const [noDataLabel, setNoDataLabel] = useState<string>("");

  const verbreekVerbindingOption: Activity = {
    id: -1,
    name: "Verbreek verbinding",
  };

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

      setIsLoading(false);
      setIsLinking(false);
    } catch (error) {
      setIsLoading(false);
      setIsLinking(false);
    }
  };

  const mappedActivities = linkableActivities.map((activity) => ({
    value: activity.id,
    label: activity.name,
  }));

  return (
    <div className={styles["customDropdown"]} style={{ marginTop: "10px" }}>
      <div className={styles["customContainer"]}>
        {paymentId === null ? (
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
                styles={{
                  control: (provided) => ({
                    ...provided,
                    color: "black",
                    borderRadius: "6px",
                    padding: "2px 5px",
                    boxShadow: "none",
                    overflow: "auto",
                  }),
                  placeholder: (provided) => ({
                    ...provided,
                    color: "black",
                  }),
                  menu: (provided) => ({
                    ...provided,
                    borderRadius: "6px",
                    padding: "10px 15px",
                    width: "100%",
                  }),
                }}
                value={
                  selectedActivity !== null
                    ? mappedActivities.find(
                        (option) => option.value === selectedActivity,
                      )
                    : null
                }
                options={mappedActivities}
                onChange={(selectedOption) =>
                  setSelectedActivity(selectedOption?.value || null)
                }
                placeholder={
                  selectedActivity !== null
                    ? ""
                    : activityName || "Verbind activiteit"
                }
                className={styles["custom-option"]}
                noOptionsMessage={() => (isLoading ? "Gegevens ophalen" : "")}
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

export default LinkInitiativePaymentToActivity;
