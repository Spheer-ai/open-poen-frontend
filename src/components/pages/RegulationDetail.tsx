import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchRegulationDetails } from "../middleware/Api";
import { useAuth } from "../../contexts/AuthContext";
import styles from "../../assets/scss/RegulationDetail.module.scss";
import EditRegulationDesktop from "../modals/EditRegulationDesktop";
import AddGrantDesktop from "../modals/AddGrantDesktop";
import EditGrantDesktop from "../modals/EditGrantDesktop";
import AddOfficerDesktop from "../modals/AddOfficerDesktop";
import { Officer } from "../../types/AddOfficerType";
import Breadcrumb from "../ui/layout/BreadCrumbs";
import AddEmployeeToRegulation from "../modals/AddEmployeeToRegulation";
import { useFetchEntityPermissions } from "../hooks/useFetchPermissions";
import GrantList from "../lists/GrantList";
import DeleteGrant from "../modals/DeleteGrant";
import DeleteRegulation from "../modals/DeleteRegulation";
import AddFundDesktop from "../modals/AddFundDesktop";
import { Grant } from "../../types/GranListType";
import useCachedImages from "../utils/images";

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
  grantId?: number;
  isBlockingInteraction: boolean;
  onRegulationEdited: () => void;
  onRegulationDeleted: () => void;
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
  const [isAddGrantModalOpen, setIsAddGrantModalOpen] = useState(
    action === "add-grant",
  );
  const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);
  const [isDeleteGrantModalOpen, setIsDeleteGrantModalOpen] = useState(false);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [isAddFundModalOpen, setIsAddFundModalOpen] = useState(false);
  const [isDeleteRegulationModalOpen, setIsDeleteRegulationModalOpen] =
    useState(false);
  const [currentGrant, setCurrentGrant] = useState<Grant | null>(null);
  const [isAddOfficerModalOpen, setIsAddOfficerModalOpen] = useState(false);
  const [selectedGrantId, setSelectedGrantId] = useState<number | null>(null);
  const [availableOfficers, setAvailableOfficers] = useState<Officer[]>([]);
  const token = user?.token;
  const { permissions, fetchPermissions } = useFetchEntityPermissions();
  const [hasEditPermission, setHasEditPermission] = useState(false);
  const [hasDeletePermission, setHasDeletePermission] = useState(false);
  const [hasCreateGrantPermission, setHasCreateGrantPermission] =
    useState(false);
  const images = useCachedImages();

  useParams();

  useEffect(() => {
    setHasCreateGrantPermission(false);
    setHasEditPermission(false);
    setHasDeletePermission(false);

    async function getRegulationDetails() {
      try {
        if (user?.token && sponsorId && regulationId) {
          const regulationPermissions: string[] | undefined =
            await fetchPermissions(
              "Regulation",
              parseInt(regulationId),
              user.token,
            );
          const funderPermissions: string[] | undefined =
            await fetchPermissions("Funder", parseInt(sponsorId), user.token);

          if (regulationPermissions && regulationPermissions.includes("edit")) {
            setHasEditPermission(true);
          }

          if (
            regulationPermissions &&
            regulationPermissions.includes("delete")
          ) {
            setHasDeletePermission(true);
          }

          if (
            regulationPermissions &&
            regulationPermissions.includes("create_grant")
          ) {
            setHasCreateGrantPermission(true);
          }

          const details = await fetchRegulationDetails(
            user.token,
            sponsorId,
            regulationId,
          );
          setRegulationDetails(details);
        } else {
          console.error("Token or sponsorId is not available");
        }
      } catch (error) {
        console.error("Failed to fetch regulation details:", error);
      }
    }
    getRegulationDetails();
  }, [sponsorId, regulationId, user, refreshTrigger]);

  useEffect(() => {
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

  const handleToggleDeleteRegulationModal = () => {
    if (isDeleteRegulationModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsDeleteRegulationModalOpen(false);
        navigate(`/sponsors/${sponsorId}`);
      }, 300);
    } else {
      setIsDeleteRegulationModalOpen(true);
      navigate(
        `/sponsors/${sponsorId}/regulations/${regulationId}/delete-regulation`,
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

  useEffect(() => {
    if (action === "add-grant") {
      setIsAddGrantModalOpen(true);
    }
  }, [action]);

  const handleToggleAddGrantModal = () => {
    if (isAddGrantModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsAddGrantModalOpen(false);
      }, 300);
    } else {
      setIsAddGrantModalOpen(true);
      navigate(`/sponsors/${sponsorId}/regulations/${regulationId}/add-grant`);
    }
  };

  const handleToggleAddFundModal = (grant: Grant | null = null) => {
    if (isAddFundModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsAddFundModalOpen(false);
        navigate(`/sponsors/${sponsorId}/regulations/${regulationId}`);
      }, 300);
    } else {
      setIsAddFundModalOpen(true);
      navigate(`/sponsors/${sponsorId}/regulations/${regulationId}/add-fund`);
    }
  };

  const handleFundAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleRegulationEdited = () => {
    setRefreshTrigger((prev) => prev + 1);
    if (onRegulationEdited) {
      onRegulationEdited();
    }
  };

  const handleRegulationDeleted = () => {
    setRefreshTrigger((prev) => prev + 1);
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

  const handleToggleDeleteGrantModal = (grantId: number | null = null) => {
    if (isDeleteGrantModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsDeleteGrantModalOpen(false);
        navigate(`/sponsors/${sponsorId}/regulations/${regulationId}`);
      }, 300);
    } else if (grantId !== null) {
      const grant = regulationDetails?.grants.find((g) => g.id === grantId);
      if (grant) {
        setCurrentGrant(grant);
        setIsDeleteGrantModalOpen(true);
        navigate(
          `/sponsors/${sponsorId}/regulations/${regulationId}/delete-grant/${grantId}`,
        );
      }
    }
  };

  const handleOfficerAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (!regulationDetails) return <p>Loading...</p>;

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

  const handleGrantDeleted = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className={styles["regulation-detail-container"]}>
      <Breadcrumb
        customBreadcrumbs={[
          <Link key="sponsors" to="/sponsors">
            Sponsoren
          </Link>,
          <Link key="regulations" to={`/sponsors/${sponsorId}/regulations`}>
            Regelingen
          </Link>,
          <Link
            key="regulation"
            to={`/sponsors/${sponsorId}/regulations/${regulationId}`}
          >
            {regulationDetails.name}
          </Link>,
        ]}
      />
      <div className={styles["regulation-detail-header"]}>
        <h1 className={styles["regulation-detail-name"]}>
          {regulationDetails.name}
        </h1>
        <div className={styles["regulation-detail-buttons"]}>
          {hasEditPermission && (
            <>
              <button
                className={styles["edit-button"]}
                onClick={handleToggleEditRegulationModal}
              >
                <img src={images.edit} alt="Edit" className={styles["icon"]} />
              </button>
            </>
          )}
          {hasDeletePermission && (
            <>
              <button
                className={styles["delete-button"]}
                onClick={handleToggleDeleteRegulationModal}
              >
                <img
                  src={images.deleteRed}
                  alt="Delete"
                  className={styles["icon"]}
                />
              </button>
            </>
          )}
        </div>
      </div>

      <p>{regulationDetails.description}</p>
      <div className={styles["button-container"]}>
        {hasCreateGrantPermission && (
          <button
            className={styles["add-button"]}
            onClick={handleToggleAddEmployeeModal}
          >
            Medewerkers
          </button>
        )}
      </div>

      <GrantList
        key={selectedRegulationId}
        grants={regulationDetails.grants}
        hasCreateGrantPermission={hasCreateGrantPermission}
        onAddGrantClick={handleToggleAddGrantModal}
        onEditGrantClick={handleToggleEditGrantModal}
        onDeleteGrantClick={handleToggleDeleteGrantModal}
        onAddOfficerClick={(grantId) => {
          setSelectedGrantId(grantId);
          handleToggleAddOfficerModal();
        }}
        onAddFundClick={(grantId) => {
          setSelectedGrantId(grantId);
          handleToggleAddFundModal();
        }}
        funderId={sponsorId ? parseInt(sponsorId) : 0}
        regulationId={regulationId ? parseInt(regulationId) : 0}
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
      <DeleteRegulation
        isOpen={isDeleteRegulationModalOpen}
        onClose={handleToggleDeleteRegulationModal}
        isBlockingInteraction={isBlockingInteraction}
        onRegulationDeleted={handleRegulationDeleted}
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
        grantId={selectedGrantId?.toString() || undefined}
      />
      <DeleteGrant
        isOpen={isDeleteGrantModalOpen}
        onClose={() => handleToggleDeleteGrantModal()}
        isBlockingInteraction={isBlockingInteraction}
        onGrantDeleted={handleGrantDeleted}
        sponsorId={sponsorId}
        regulationId={regulationId}
        grant={currentGrant}
        grantId={selectedGrantId?.toString() || undefined}
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
      <AddFundDesktop
        isOpen={isAddFundModalOpen}
        onClose={handleToggleAddFundModal}
        isBlockingInteraction={isBlockingInteraction}
        onFundAdded={handleFundAdded}
        funderId={sponsorId ? parseInt(sponsorId) : 0}
        regulationId={regulationId ? parseInt(regulationId) : 0}
        grantId={selectedGrantId?.toString() || undefined}
      />
    </div>
  );
};

export default RegulationDetail;
