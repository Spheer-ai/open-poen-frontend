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
  initiativeId: number | null; // Change the type to allow null
  onInitiativeLinked: (initiativeId: number | null) => void; // Change the parameter type
  isActivityLinked: boolean;
}

const LinkInitiativeToPayment: React.FC<LinkInitiativeToPaymentProps> = ({
  token,
  paymentId,
  initiativeName,
  onInitiativeLinked,
  isActivityLinked,
  initiativeId, // Receive the initiativeId prop
}) => {
  const [linkableInitiatives, setLinkableInitiatives] = useState<Initiative[]>(
    [],
  );
  const [selectedInitiative, setSelectedInitiative] = useState<number | "">("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSelectClicked, setIsSelectClicked] = useState<boolean>(false); // Track if select is clicked

  // Create a constant for the "Verbreek verbinding" option
  const verbreekVerbindingOption: Initiative = {
    id: -1, // Assign a unique identifier, it can be any value that won't conflict with real IDs
    name: "Verbreek verbinding",
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

          // Add "Verbreek verbinding" option to the list of linkable initiatives
          setLinkableInitiatives([verbreekVerbindingOption, ...initiatives]);

          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching linkable initiatives:", error);
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
      setIsLoading(true);
      if (selectedInitiative !== undefined) {
        // Handle "Verbreek verbinding" option
        if (selectedInitiative === verbreekVerbindingOption.id) {
          await linkInitiativeToPayment(token, paymentId, null);
          onInitiativeLinked(null);
        } else {
          await linkInitiativeToPayment(token, paymentId, selectedInitiative);
          onInitiativeLinked(selectedInitiative as number | null); // Change the argument type
        }

        console.log("Link Initiative to Payment successful!");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error linking initiative to payment:", error);
      setIsLoading(false);
    }
  };

  const mappedInitiatives = linkableInitiatives.map((initiative) => ({
    value: initiative.id,
    label: initiative.name,
  }));

  const handleSelectClick = () => {
    setIsSelectClicked(true); // Set select as clicked when the user interacts with it
  };

  return (
    <div className={styles["customDropdown"]}>
      {isActivityLinked ? (
        <div className={styles["disabled-dropdown"]}>
          <span className={styles["initiativeText"]}>Verbind initiatief</span>
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

export default LinkInitiativeToPayment;
