import React from "react";
import styles from "../../../../assets/scss/FundsDetails.module.scss";

interface ActivityDetailsProps {
  name?: string;
  description?: string;
  purpose?: string;
  target_audience?: string;
  kvk_registration?: string;
  location?: string;
}

const ActivityDetails: React.FC<ActivityDetailsProps> = ({
  name,
  description,
  purpose,
  target_audience,
  kvk_registration,
  location,
}) => {
  return (
    <div className={styles["details-container"]}>
      <div className={styles["details-wrapper"]}>
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
        <label>Locatie-inflatie</label>
        <p>{location}</p>
      </div>
    </div>
  );
};

export default ActivityDetails;
