import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchRegulationDetails } from "../middleware/Api";
import { useAuth } from "../../contexts/AuthContext";
import styles from "../../assets/scss/RegulationDetail.module.scss";
import EditRegulationDesktop from "../modals/EditRegulationDesktop";
import EditRegulationMobile from "../modals/EditRegulationMobile";
import EditIcon from "/edit-icon.svg";

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
  isBlockingInteraction: boolean;
}

const RegulationDetail: React.FC<RegulationDetailProps> = ({
  regulationId,
}) => {
  const { sponsorId } = useParams<{ sponsorId?: string }>();
  const { action } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(action === "edit-regulation");
  const [regulationDetails, setRegulationDetails] =
    useState<RegulationDetailType | null>(null);
  const { user } = useAuth();
  const [selectedRegulationId, setSelectedRegulationId] = useState<
    string | null
  >(null);
  const [isBlockingInteraction, setIsBlockingInteraction] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const isMobileScreen = window.innerWidth < 768;

  const token = user?.token;
  useParams();

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
  }, [sponsorId, regulationId, user, refreshTrigger]);

  useEffect(() => {
    console.log("action:", action);
    if (action === "edit-regulation") {
      setIsModalOpen(true);
    }
  }, [action]);

  const handleToggleEditRegulationModal = () => {
    if (isModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsModalOpen(false);
      }, 300);
    } else {
      setIsModalOpen(true);
      navigate(
        `/sponsors/${sponsorId}/regulations/${regulationId}/edit-regulation`,
      );
    }
  };

  const handleRegulationEdited = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (!regulationDetails) return <p>Loading...</p>;

  return (
    <div className={styles["regulation-detail-container"]}>
      <div className={styles["regulation-detail-header"]}>
        <h1>{regulationDetails.name}</h1>
        <button
          className={styles["edit-button"]}
          onClick={handleToggleEditRegulationModal}
        >
          <img src={EditIcon} alt="Edit" className={styles["icon"]} />
          Regeling bewerken
        </button>
      </div>

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
      {isMobileScreen ? (
        <EditRegulationMobile
          isOpen={isModalOpen}
          onClose={handleToggleEditRegulationModal}
          isBlockingInteraction={isBlockingInteraction}
          onRegulationEdited={handleRegulationEdited}
          sponsorId={sponsorId}
          regulationId={regulationId}
          refreshTrigger={refreshTrigger}
          currentName={""}
          currentDescription={""}
        />
      ) : (
        <EditRegulationDesktop
          isOpen={isModalOpen}
          onClose={handleToggleEditRegulationModal}
          isBlockingInteraction={isBlockingInteraction}
          onRegulationEdited={handleRegulationEdited}
          sponsorId={sponsorId}
          regulationId={regulationId}
          refreshTrigger={refreshTrigger}
          currentName={""}
          currentDescription={""}
        />
      )}
    </div>
  );
};

export default RegulationDetail;
