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
  initiativeId: number;
  onInitiativeLinked: (initiativeId: number) => void;
}

const LinkInitiativeToPayment: React.FC<LinkInitiativeToPaymentProps> = ({
  token,
  paymentId,
  initiativeName,
  onInitiativeLinked,
}) => {
  const [linkableInitiatives, setLinkableInitiatives] = useState<Initiative[]>(
    [],
  );
  const [selectedInitiative, setSelectedInitiative] = useState<number | "">("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getLinkableInitiativesForPayment = async () => {
      try {
        setIsLoading(true);
        const initiatives: Initiative[] = await fetchLinkableInitiatives(
          token,
          paymentId,
        );
        console.log("Initiatives:", initiatives);
        setLinkableInitiatives(initiatives);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching linkable initiatives:", error);
        setIsLoading(false);
      }
    };

    getLinkableInitiativesForPayment();
  }, [token, paymentId]);

  useEffect(() => {
    if (selectedInitiative !== "") {
      handleLinkInitiative();
    }
  }, [selectedInitiative]);

  const handleLinkInitiative = async () => {
    try {
      setIsLoading(true);
      if (selectedInitiative !== undefined) {
        const user_ids = selectedInitiative === "" ? [] : [selectedInitiative];

        console.log("Link Initiative to Payment Request Data:");
        console.log("Token:", token);
        console.log("Payment ID:", paymentId);
        console.log("User IDs:", user_ids);

        await linkInitiativeToPayment(token, paymentId, selectedInitiative);

        onInitiativeLinked(selectedInitiative as number);

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

  return (
    <div className={styles["customDropdown"]}>
      {isLoading ? (
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
          <div className="custom-dropdown-container">
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
