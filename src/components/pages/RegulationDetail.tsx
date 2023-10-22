import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchRegulationDetails } from "../middleware/Api";
import { useAuth } from "../../contexts/AuthContext";
import styles from "../../assets/scss/RegulationDetail.module.scss";

type Officer = {
  email: string;
  first_name: string;
  last_name: string;
  biography: string;
  role: string;
  image: string;
};

type Grant = {
  name: string;
  reference: string;
  budget: number;
  income: number;
  expenses: number;
};

type RegulationDetailType = {
  name: string;
  description: string;
  grant_officers: Officer[];
  policy_officers: Officer[];
  grants: Grant[];
};

interface RegulationDetailProps {
  regulationId?: string;
}

const RegulationDetail: React.FC<RegulationDetailProps> = ({
  regulationId,
}) => {
  const { sponsorId } = useParams<{ sponsorId?: string }>();

  const [regulationDetails, setRegulationDetails] =
    useState<RegulationDetailType | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    async function getRegulationDetails() {
      try {
        console.log("Checking values: user.token", user?.token);
        console.log("Checking values: sponsorId", sponsorId);
        console.log("Checking values: regulationId", regulationId);
        if (user?.token && sponsorId && regulationId) {
          const details = await fetchRegulationDetails(
            user.token,
            sponsorId,
            regulationId,
          );
          setRegulationDetails(details);
        } else {
          console.error("Token, sponsorId, or regulationId is not available");
        }
      } catch (error) {
        console.error("Failed to fetch regulation details:", error);
      }
    }
    getRegulationDetails();
  }, [sponsorId, regulationId, user]);

  if (!regulationDetails) return <p>Loading...</p>;

  return (
    <div className={styles["regulation-detail-container"]}>
      <h1>{regulationDetails.name}</h1>
      <p>{regulationDetails.description}</p>

      <h3 className={styles["section-title"]}>BESCHIKKINGEN</h3>
      <ul className={styles["grant-list"]}>
        {regulationDetails.grants.map((grant, index) => (
          <li key={index} className={styles["grant-item"]}>
            {grant.name} | {grant.reference} | € {grant.budget}
          </li>
        ))}
      </ul>

      <h3 className={styles["section-title"]}>Grant Officers:</h3>
      <ul className={styles["officer-list"]}>
        {regulationDetails.grant_officers.map((officer, index) => (
          <li key={index} className={styles["officer-item"]}>
            {officer.first_name} {officer.last_name} ({officer.email})
          </li>
        ))}
      </ul>

      <h3 className={styles["section-title"]}>Policy Officers:</h3>
      <ul className={styles["officer-list"]}>
        {regulationDetails.policy_officers.map((officer, index) => (
          <li key={index} className={styles["officer-item"]}>
            {officer.first_name} {officer.last_name} ({officer.email})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RegulationDetail;
