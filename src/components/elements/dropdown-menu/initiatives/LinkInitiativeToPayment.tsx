import React, { useState, useEffect } from "react";
import Select from "react-dropdown-select";
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
  const [selectedInitiative, setSelectedInitiative] = useState<number | "">("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSelectClicked, setIsSelectClicked] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [noDataLabel, setNoDataLabel] = useState<string>("");
  const [isLinking, setIsLinking] = useState<boolean>(false);

  const verbreekVerbindingOption: Initiative = {
    id: -1,
    name: "Verbreek verbinding",
  };

  const handleInitiativeNameClick = () => {
    setIsDropdownOpen(true);

    if (!isSelectClicked) {
      setIsSelectClicked(true);
      setNoDataLabel("Gegevens ophalen");
    }
  };

  useEffect(() => {
    if (isSelectClicked) {
      const getLinkableInitiativesForPayment = async () => {
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
      };

      getLinkableInitiativesForPayment();
    }
  }, [token, paymentId, isSelectClicked]);

  useEffect(() => {
    if (selectedInitiative !== "") {
      handleLinkInitiative();
    }
  }, [selectedInitiative]);

  const handleLinkInitiative = async () => {
    try {
      setIsLinking(true);
      setIsLoading(true);

      if (selectedInitiative !== undefined) {
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
          <div
            onClick={handleInitiativeNameClick}
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
                  selectedInitiative === ""
                    ? []
                    : mappedInitiatives.filter(
                        (option) => option.value === selectedInitiative,
                      )
                }
                options={mappedInitiatives}
                onChange={(values) =>
                  setSelectedInitiative(values[0] ? values[0].value : "")
                }
                labelField="label"
                valueField="value"
                placeholder={
                  selectedInitiative === ""
                    ? initiativeName || "Verbind initiatief"
                    : mappedInitiatives.find(
                        (option) => option.value === selectedInitiative,
                      )?.label || ""
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

export default LinkInitiativeToPayment;
