import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchRegulationDetails } from "../middleware/Api";
import { useAuth } from "../../contexts/AuthContext";
import styles from "../../assets/scss/RegulationDetail.module.scss";
import EditRegulationDesktop from "../modals/EditRegulationDesktop";
import EditRegulationMobile from "../modals/EditRegulationMobile";
import AddGrantDesktop from "../modals/AddGrantDesktop";
import EditIcon from "/edit-icon.svg";
import AddGrantMobile from "../modals/AddGrantMobile";
import EditGrantDesktop from "../modals/EditGrantDesktop";
import EditGrantMobile from "../modals/EditGrantMobile";
import AddOfficerDesktop from "../modals/AddOfficerDesktop";
import AddOfficerMobile from "../modals/AddOfficerMobile";
import { Officer } from "../../types/AddOfficerType";

type Grant = {
  id: number;
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
  onRegulationEdited: () => void;
}

const RegulationDetail: React.FC<RegulationDetailProps> = ({
  regulationId,
  onRegulationEdited,
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
  const [isAddGrantModalOpen, setIsAddGrantModalOpen] = useState(false);
  const isMobileScreen = window.innerWidth < 768;
  const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);
  const [currentGrant, setCurrentGrant] = useState<Grant | null>(null);
  const [isAddOfficerModalOpen, setIsAddOfficerModalOpen] = useState(false);
  const [selectedGrantId, setSelectedGrantId] = useState<number | null>(null);
  const [availableOfficers, setAvailableOfficers] = useState<Officer[]>([]);
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
          console.log("Fetched details:", details);
          setRegulationDetails(details);
          setRegulationDetails(details);
        } else {
          console.error("Token, sponsorId, or regulationId is not available");
        }
      } catch (error) {
        console.error("Failed to fetch regulation details:", error);
      }
      if (regulationDetails) {
        setAvailableOfficers(regulationDetails.policy_officers);
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
        navigate(`/sponsors/${sponsorId}/regulations/${regulationId}`);
      }, 300);
    } else {
      setIsModalOpen(true);
      navigate(
        `/sponsors/${sponsorId}/regulations/${regulationId}/edit-regulation`,
      );
    }
  };

  const handleToggleAddGrantModal = () => {
    if (isAddGrantModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsAddGrantModalOpen(false);
        navigate(`/sponsors/${sponsorId}/regulations/${regulationId}`);
      }, 300);
    } else {
      setIsAddGrantModalOpen(true);
      navigate(`/sponsors/${sponsorId}/regulations/${regulationId}/add-grant`);
    }
  };

  const handleRegulationEdited = () => {
    setRefreshTrigger((prev) => prev + 1);
    if (onRegulationEdited) {
      onRegulationEdited();
    }
  };

  const handleGrantAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleToggleEditGrantModal = (grant: Grant | null = null) => {
    if (isGrantModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsGrantModalOpen(false);
        navigate(`/sponsors/${sponsorId}/regulations/${regulationId}`);
      }, 300);
    } else if (grant) {
      setCurrentGrant(grant);
      setIsGrantModalOpen(true);
      navigate(
        `/sponsors/${sponsorId}/regulations/${regulationId}/edit-grant/${grant.id}`,
      );
    }
  };

  const handleOfficerAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (!regulationDetails) return <p>Loading...</p>;
  console.log("Current Grant:", currentGrant);

  const handleToggleAddOfficerModal = () => {
    if (isAddOfficerModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsAddOfficerModalOpen(false);
        navigate(`/sponsors/${sponsorId}/regulations/${regulationId}`);
      }, 300);
    } else {
      setIsAddOfficerModalOpen(true);
      navigate(
        `/sponsors/${sponsorId}/regulations/${regulationId}/add-officer`,
      );
    }
  };

  const handleGrantEdited = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

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
      <div className={styles["grant-container"]}>
        <h3 className={styles["section-title"]}>BESCHIKKINGEN</h3>
        <button
          className={styles["add-button"]}
          onClick={handleToggleAddGrantModal}
        >
          Beschikking toevoegen
        </button>
      </div>
      <ul className={styles["grant-list"]}>
        {regulationDetails.grants.map((grant, index) => (
          <li key={index} className={styles["grant-item"]}>
            {grant.name} | {grant.reference} | € {grant.budget}
            <div className={styles["button-container"]}>
            <button
              className={styles["add-button"]}
              onClick={() => {
                setSelectedGrantId(grant.id);
                handleToggleAddOfficerModal();
              }}
            >
              Officer toevoegen
            </button>
            <button
              className={styles["edit-button"]}
              onClick={() => handleToggleEditGrantModal(grant)}
            >
              <img src={EditIcon} alt="Edit" className={styles["icon"]} />
              Bewerken
            </button>
            </div>
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
          currentName={regulationDetails.name}
          currentDescription={regulationDetails.description}
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
          currentName={regulationDetails.name}
          currentDescription={regulationDetails.description}
        />
      )}
      {isMobileScreen ? (
        <AddGrantMobile
          isOpen={isAddGrantModalOpen}
          onClose={handleToggleAddGrantModal}
          onGrantAdded={handleGrantAdded}
          sponsorId={sponsorId}
          regulationId={regulationId}
          isBlockingInteraction={isBlockingInteraction}
          refreshTrigger={refreshTrigger}
        />
      ) : (
        <AddGrantDesktop
          isOpen={isAddGrantModalOpen}
          onClose={handleToggleAddGrantModal}
          onGrantAdded={handleGrantAdded}
          sponsorId={sponsorId}
          regulationId={regulationId}
          isBlockingInteraction={isBlockingInteraction}
          refreshTrigger={refreshTrigger}
        />
      )}
      {isMobileScreen ? (
        <EditGrantMobile
          isOpen={isGrantModalOpen}
          onClose={() => handleToggleEditGrantModal(currentGrant)}
          isBlockingInteraction={isBlockingInteraction}
          onGrantEdited={handleGrantEdited}
          sponsorId={sponsorId}
          regulationId={regulationId}
          grant={currentGrant}
          currentName={currentGrant?.name || ""}
          currentReference={currentGrant?.reference || ""}
          currentBudget={currentGrant?.budget || 0}
        />
      ) : (
        <EditGrantDesktop
          isOpen={isGrantModalOpen}
          onClose={() => handleToggleEditGrantModal(currentGrant)}
          isBlockingInteraction={isBlockingInteraction}
          onGrantEdited={handleGrantEdited}
          sponsorId={sponsorId}
          regulationId={regulationId}
          grant={currentGrant}
          currentName={currentGrant?.name || ""}
          currentReference={currentGrant?.reference || ""}
          currentBudget={currentGrant?.budget || 0}
        />
      )}
      {isMobileScreen ? (
        <AddOfficerMobile
          isOpen={isAddOfficerModalOpen}
          onClose={handleToggleAddOfficerModal}
          onOfficerAdded={handleOfficerAdded}
          sponsorId={sponsorId}
          regulationId={regulationId}
          grantId={selectedGrantId?.toString() || undefined}
          officers={availableOfficers}
          isBlockingInteraction={false}
        />
      ) : (
        <AddOfficerDesktop
          isOpen={isAddOfficerModalOpen}
          onClose={handleToggleAddOfficerModal}
          onOfficerAdded={handleOfficerAdded}
          sponsorId={sponsorId}
          regulationId={regulationId}
          grantId={selectedGrantId?.toString() || undefined}
          officers={availableOfficers}
          isBlockingInteraction={false}
        />
      )}
    </div>
  );
};

export default RegulationDetail;
