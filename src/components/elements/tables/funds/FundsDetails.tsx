import React from "react";
import styles from "../../../../assets/scss/FundsDetails.module.scss";

interface FundDetailsProps {
  name?: string;
  description?: string;
  purpose?: string;
  target_audience?: string;
  kvk_registration?: string;
  location?: string;
}

const FundDetails: React.FC<FundDetailsProps> = ({
  name,
  description,
  purpose,
  target_audience,
  kvk_registration,
  location,
}) => {
  return (
    <div className={styles["details-container"]}>
      <label>Naam</label>
      <p>{name}</p>
      <label>Beschrijving</label>
      <p>{description}</p>
      <label>Doel</label>
      <p>{purpose}</p>
      <label>Doelgroep</label>
      <p>{target_audience}</p>
      <label>Kamer van Koophandel</label>
      <p>{kvk_registration}</p>
      <label>Locatie-initiatief</label>
      <p>{location}</p>
    </div>
  );
};

export default FundDetails;
