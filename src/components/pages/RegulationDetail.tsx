import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchRegulationDetails } from "../middleware/Api";
import { useAuth } from "../../contexts/AuthContext";
import styles from "../../assets/scss/RegulationDetail.module.scss";
import EditRegulationDesktop from "../modals/EditRegulationDesktop";
import AddGrantDesktop from "../modals/AddGrantDesktop";
import EditIcon from "/edit-icon.svg";
import EditGrantDesktop from "../modals/EditGrantDesktop";
import AddOfficerDesktop from "../modals/AddOfficerDesktop";
import { Officer } from "../../types/AddOfficerType";
import Breadcrumb from "../ui/layout/BreadCrumbs";
import AddEmployeeToRegulation from "../modals/AddEmployeeToRegulation";
import { usePermissions } from "../../contexts/PermissionContext";
import GrantList from "../lists/GrantList";

type Grant = {
  id: number;
  name: string;
  reference: string;
  budget: number;
  income: number;
  expenses: number;
  permissions: string[];
};

type RegulationDetailType = {
  name: string;
  description: string;
  grant_officers: Officer[];
  policy_officers: Officer[];
  grants: Grant[];
  entityPermissions: string[];
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
  const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [currentGrant, setCurrentGrant] = useState<Grant | null>(null);
  const [isAddOfficerModalOpen, setIsAddOfficerModalOpen] = useState(false);
  const [selectedGrantId, setSelectedGrantId] = useState<number | null>(null);
  const [availableOfficers, setAvailableOfficers] = useState<Officer[]>([]);
  const token = user?.token;
  const { fetchPermissions } = usePermissions();
  const [hasEditPermission, setHasEditPermission] = useState(false);
  const [hasCreateGrantPermission, setHasCreateGrantPermission] =
    useState(false);
  const [grantPermissions, setGrantPermissions] = useState<
    Record<number, string[]>
  >({});

  useParams();

  useEffect(() => {
    async function getRegulationDetails() {
      try {
        console.log("Checking values: user.token", user?.token);
        console.log("Checking values: sponsorId", sponsorId);
        console.log("Checking values: regulationId", regulationId);
        if (user?.token && sponsorId && regulationId) {
          const permissions: string[] | undefined = await fetchPermissions(
            "Regulation",
            parseInt(regulationId),
            user.token,
          );
          console.log("Fetched permissions for the regulation:", permissions);

          if (permissions && permissions.includes("edit")) {
            setHasEditPermission(true);
          }

          if (permissions && permissions.includes("create_grant")) {
            setHasCreateGrantPermission(true);
          }

          const details = await fetchRegulationDetails(
            user.token,
            sponsorId,
            regulationId,
          );
          console.log("Fetched regulation details:", details);
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
        navigate(`/sponsors/${sponsorId}/regulations/${regulationId}`);
      }, 300);
    } else {
      setIsModalOpen(true);
      navigate(
        `/sponsors/${sponsorId}/regulations/${regulationId}/edit-regulation`,
      );
    }
  };

  const handleToggleAddEmployeeModal = () => {
    if (isAddEmployeeModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsAddEmployeeModalOpen(false);
        navigate(`/sponsors/${sponsorId}/regulations/${regulationId}`);
      }, 300);
    } else {
      setIsAddEmployeeModalOpen(true);
      navigate(
        `/sponsors/${sponsorId}/regulations/${regulationId}/add-employee`,
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

  const handleEmployeeAdded = () => {
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
      <Breadcrumb />
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
      <div className={styles["button-container"]}>
        <button
          className={styles["add-button"]}
          onClick={handleToggleAddEmployeeModal}
        >
          Medewerkers
        </button>
      </div>

      <GrantList
        key={selectedRegulationId}
        grants={regulationDetails.grants}
        grantPermissions={grantPermissions}
        hasCreateGrantPermission={hasCreateGrantPermission}
        onAddGrantClick={handleToggleAddGrantModal}
        onEditGrantClick={handleToggleEditGrantModal}
        onAddOfficerClick={(grantId) => {
          setSelectedGrantId(grantId);
          handleToggleAddOfficerModal();
        }}
      />

      <h3 className={styles["section-title"]}>Subsidiemedewerkers:</h3>
      <ul className={styles["officer-list"]}>
        {regulationDetails.grant_officers.map((officer, index) => (
          <li key={index} className={styles["officer-item"]}>
            {officer.email}
          </li>
        ))}
      </ul>

      <h3 className={styles["section-title"]}>Beleidsmedewerkers:</h3>
      <ul className={styles["officer-list"]}>
        {regulationDetails.policy_officers.map((officer, index) => (
          <li key={index} className={styles["officer-item"]}>
            {officer.email}
          </li>
        ))}
      </ul>
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
      <AddGrantDesktop
        isOpen={isAddGrantModalOpen}
        onClose={handleToggleAddGrantModal}
        onGrantAdded={handleGrantAdded}
        sponsorId={sponsorId}
        regulationId={regulationId}
        isBlockingInteraction={isBlockingInteraction}
        refreshTrigger={refreshTrigger}
      />
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
      <AddEmployeeToRegulation
        isOpen={isAddEmployeeModalOpen}
        onClose={handleToggleAddEmployeeModal}
        isBlockingInteraction={isBlockingInteraction}
        onEmployeeAdded={handleEmployeeAdded}
        sponsorId={sponsorId}
        regulationId={regulationId}
      />
    </div>
  );
};

export default RegulationDetail;
