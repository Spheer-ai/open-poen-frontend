import React, { useState, useEffect } from "react";
import Select from "react-select";
import styles from "../../../../assets/scss/TransactionOverview.module.scss";
import LoadingDot from "../../../animation/LoadingDot";
import {
  fetchLinkableInitiatives,
  linkInitiativeToPayment,
} from "../../../middleware/Api";

interface Initiative {
  id: number;
  name: string;
}

interface LinkInitiativeToPaymentProps {
  token: string;
  paymentId: number;
  initiativeName: string;
  initiativeId: number | null;
  onInitiativeLinked: (initiativeId: number | null) => void;
  isActivityLinked: boolean;
  linkingStatus: Record<
    number,
    { initiativeId: number | null; activityId: number | null }
  >;
}

const LinkInitiativeToPayment: React.FC<LinkInitiativeToPaymentProps> = ({
  token,
  paymentId,
  initiativeName,
  onInitiativeLinked,
  isActivityLinked,
}) => {
  const [linkableInitiatives, setLinkableInitiatives] = useState<Initiative[]>(
    [],
  );
  const [selectedInitiative, setSelectedInitiative] = useState<number | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSelectClicked, setIsSelectClicked] = useState<boolean>(false);
  const [isLinking, setIsLinking] = useState<boolean>(false);

  const verbreekVerbindingOption: Initiative = {
    id: -1,
    name: "Verbreek verbinding",
  };

  const handleInitiativeNameClick = async () => {
    if (!isSelectClicked) {
      setIsSelectClicked(true);

      try {
        setIsLoading(true);
        const initiatives: Initiative[] = await fetchLinkableInitiatives(
          token,
          paymentId,
        );

        setLinkableInitiatives([verbreekVerbindingOption, ...initiatives]);

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    }
  };

  const handleInputClick = async () => {
    handleInitiativeNameClick();
  };

  useEffect(() => {
    if (selectedInitiative !== null) {
      handleLinkInitiative();
    }
  }, [selectedInitiative]);

  const handleLinkInitiative = async () => {
    try {
      setIsLinking(true);
      setIsLoading(true);

      if (selectedInitiative !== null) {
        if (selectedInitiative === verbreekVerbindingOption.id) {
          await linkInitiativeToPayment(token, paymentId, null);
          onInitiativeLinked(null);
        } else {
          await linkInitiativeToPayment(token, paymentId, selectedInitiative);
          onInitiativeLinked(selectedInitiative as number | null);
        }
      }
      setIsLoading(false);
      setIsLinking(false);
    } catch (error) {
      setIsLoading(false);
      setIsLinking(false);
    }
  };

  const mappedInitiatives = linkableInitiatives.map((initiative) => ({
    value: initiative.id,
    label: initiative.name,
  }));

  return (
    <div className={styles["customDropdown"]}>
      <div className={styles["customContainer"]}>
        {isActivityLinked ? (
          <div className={styles["disabled-dropdown"]}>
            <span className={styles["initiativeText"]}>
              {" "}
              {initiativeName || "Verbind initiatief"}
            </span>
          </div>
        ) : (
          <div onClick={handleInputClick} className="custom-dropdown-container">
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
                    width: "225px",
                  }),
                }}
                value={
                  selectedInitiative === null
                    ? null
                    : mappedInitiatives.find(
                        (option) => option.value === selectedInitiative,
                      )
                }
                options={mappedInitiatives}
                onChange={(selectedOption) =>
                  setSelectedInitiative(selectedOption?.value || null)
                }
                placeholder={
                  selectedInitiative === null
                    ? initiativeName || "Verbind initiatief"
                    : mappedInitiatives.find(
                        (option) => option.value === selectedInitiative,
                      )?.label || ""
                }
                noOptionsMessage={() => (isLoading ? "Gegevens ophalen" : "")}
                className={styles["custom-option"]}
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

export default LinkInitiativeToPayment;
