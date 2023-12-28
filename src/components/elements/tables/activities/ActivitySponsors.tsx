import React from "react";
import styles from "../../../../assets/scss/FundsSponsor.module.scss";

interface FundsSponsorsProps {
  grantId?: number;
  grantName?: string;
  grantReference?: string;
  grantBudget?: number;
}

const FundsSponsors: React.FC<FundsSponsorsProps> = ({
  grantId,
  grantName,
  grantReference,
  grantBudget,
}) => {
  const formattedBudget = grantBudget?.toLocaleString("nl-NL", {
    style: "currency",
    currency: "EUR",
  });
  return (
    <div className={styles["details-container"]}>
      <div className={styles["details-item"]}>
        <label>Subsidieregeling:</label>
        {grantName && <p>{grantName}</p>}
      </div>
      <div className={styles["details-item"]}>
        <label>Beslissingsnummer/referentie: </label>
        {grantReference && <p>{grantReference}</p>}
      </div>
      <div className={styles["details-item"]}>
        <label>Begroting:</label>
        {formattedBudget && <p>{formattedBudget}</p>}
      </div>
      <div className={styles["details-item"]}>
        <label>Verantwoordelijk:</label>
        {<p>Nee</p>}
      </div>
      <div className={styles["details-item"]}>
        <label>Verantwoordelijkheid:</label>
        {<p>Nee</p>}
      </div>
      <hr></hr>
    </div>
  );
};

export default FundsSponsors;
