import React, { useEffect, useState } from "react";
import styles from "../../../../assets/scss/FundsSponsor.module.scss";
import LoadingDot from "../../../animation/LoadingDot";
import {
  fetchGrantDetails,
  fetchRegulationDetails,
} from "../../../middleware/Api";

interface ActivitySponsorsProps {
  grantId?: number;
  grantName?: string;
  grantReference?: string;
  grantBudget?: number;
  token: string;
}

const ActivitySponsors: React.FC<ActivitySponsorsProps> = ({
  grantId,
  grantName,
  grantReference,
  grantBudget,
  token,
}) => {
  const formattedBudget = grantBudget?.toLocaleString("nl-NL", {
    style: "currency",
    currency: "EUR",
  });
  const [grantDetails, setGrantDetails] = useState<any>(null);
  const [regulationDetails, setRegulationDetails] = useState<any>(null);
  const [loadingGrantDetails, setLoadingGrantDetails] = useState<boolean>(true);
  const [loadingRegulationDetails, setLoadingRegulationDetails] =
    useState<boolean>(true);

  useEffect(() => {
    if (grantId) {
      setLoadingGrantDetails(true);
      setLoadingRegulationDetails(true);

      fetchGrantDetails(token, 0, 0, grantId)
        .then((data) => {
          setGrantDetails(data);
          setLoadingGrantDetails(false);

          if (data && data.regulation && data.regulation.id) {
            const regulationId = data.regulation.id;

            fetchRegulationDetails(token, "0", regulationId)
              .then((regulationData) => {
                setRegulationDetails(regulationData);
                setLoadingRegulationDetails(false);
              })
              .catch((regulationError) => {
                console.error(
                  "Error fetching regulation details:",
                  regulationError,
                );
                setLoadingRegulationDetails(false);
              });
          } else {
            setLoadingRegulationDetails(false);
          }
        })
        .catch((grantError) => {
          console.error("Error fetching grant details:", grantError);
          setLoadingGrantDetails(false);
        });
    }
  }, [grantId, token]);

  if (loadingGrantDetails || loadingRegulationDetails) {
    return (
      <div className={styles["loading-container"]}>
        <LoadingDot delay={0} />
        <LoadingDot delay={0.1} />
        <LoadingDot delay={0.1} />
        <LoadingDot delay={0.2} />
        <LoadingDot delay={0.2} />
      </div>
    );
  }

  return (
    <div className={styles["details-wrapper"]}>
      {regulationDetails && regulationDetails.funder && (
        <div className={styles["funder-details-container"]}>
          <div className={styles["blue-circle"]}>
            <img src="/blue-circle.svg" alt="Blue Circle" />
          </div>
          <div className={styles["funder-details"]}>
            <div className={styles["details-item"]}>
              <p className={styles["details-bold"]}>
                {regulationDetails.funder.name}
              </p>
            </div>
            <div className={styles["details-item"]}>
              <p>Regeling: {regulationDetails.name}</p>
            </div>
          </div>
        </div>
      )}
      <div className={styles["details-container"]}>
        <div className={styles["details-item"]}>
          <label>Subsidieregeling:</label>
          {grantName && <p>{grantName}</p>}
        </div>
        <div className={styles["details-item"]}>
          <label>Beschikkingsnummer: </label>
          {grantReference && <p>{grantReference}</p>}
        </div>
        <div className={styles["details-item"]}>
          <label>Begroting:</label>
          {formattedBudget && <p>{formattedBudget}</p>}
        </div>
        <div className={styles["details-item"]}>
          <label>Verantwoord:</label>
          {grantDetails && grantDetails.verantwoordelijk ? (
            <p>{grantDetails.verantwoordelijk}</p>
          ) : (
            <p>Nee</p>
          )}
        </div>
        <div className={styles["details-item"]}>
          <label>Verantwoording:</label>
          {grantDetails && grantDetails.verantwoordelijkheid ? (
            <p>{grantDetails.verantwoordelijkheid}</p>
          ) : (
            <p>Nee</p>
          )}
        </div>
      </div>
      <hr></hr>
    </div>
  );
};
export default ActivitySponsors;
