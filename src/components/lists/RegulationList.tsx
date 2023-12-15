import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../../assets/scss/RegulationList.module.scss";
import TopNavigationBar from "../ui/top-navigation-bar/TopNavigationBar";
import { fetchFunderRegulations } from "../middleware/Api";
import { useAuth } from "../../contexts/AuthContext";
import RegulationDetail from "../pages/RegulationDetail";
import AddRegulationDesktop from "../modals/AddRegulationDesktop";
import { usePermissions } from "../../contexts/PermissionContext";
import LoadingDot from "../animation/LoadingDot";

type Regulation = {
  id: string;
  name: string;
};

const RegulationList = () => {
  const { sponsorId } = useParams<{ sponsorId: string }>();
  const { action } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(action === "add-regulation");
  const navigate = useNavigate();
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const { user } = useAuth();
  const [selectedRegulationId, setSelectedRegulationId] = useState<
    string | null
  >(null);
  const [isBlockingInteraction, setIsBlockingInteraction] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { fetchPermissions } = usePermissions();
  const [permissionsFetched, setPermissionsFetched] = useState(false);
  const [entityPermissions, setEntityPermissions] = useState<string[]>([]);
  const hasPermission = entityPermissions.includes("create");
  const token = user?.token;
  useParams();

  useEffect(() => {
    console.log("action:", action);

    if (user && user.token && !permissionsFetched) {
      fetchPermissions("Funder", undefined, user.token)
        .then((permissions) => {
          setEntityPermissions(permissions || []);
          setPermissionsFetched(true);
        })
        .catch((error) => {
          console.error("Failed to fetch permissions:", error);
          setPermissionsFetched(true);
        });
    }
  }, [action, user, fetchPermissions, permissionsFetched]);

  useEffect(() => {
    async function getRegulations() {
      try {
        console.log("Checking values: token", token);
        console.log("Checking values: sponsorId", sponsorId);
        if (token && sponsorId) {
          const fetchedRegulations = await fetchFunderRegulations(
            token,
            sponsorId,
          );
          setRegulations(fetchedRegulations);

          if (fetchedRegulations && fetchedRegulations.length > 0) {
            setSelectedRegulationId(fetchedRegulations[0].id.toString());
          }
        }
      } catch (error) {
        console.error("Failed to fetch regulations:", error);
      }
    }

    getRegulations();
  }, [sponsorId, token, refreshTrigger]);

  useEffect(() => {
    console.log("action:", action);
    if (action === "add-regulation") {
      setIsModalOpen(true);
    }
  }, [action]);

  const handleToggleAddRegulationModal = () => {
    if (isModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsModalOpen(false);
        navigate(`/sponsors/${sponsorId}/regulations/`);
      }, 300);
    } else {
      setIsModalOpen(true);
      navigate(`/sponsors/${sponsorId}/regulations/add-regulation`);
    }
  };

  const handleBackClick = () => {
    navigate("/sponsors");
  };

  const handleSearch = (query) => {
    console.log("Search query in UserDetailsPage:", query);
  };

  const handleRegulationClick = (regulationId: string) => {
    navigate(`/sponsors/${sponsorId}/regulations/${regulationId}`);
    setSelectedRegulationId(regulationId);
  };

  const handleRegulationAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleRegulationEdited = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleRegulationDeleted = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className={styles["container"]}>
      <div className={styles["side-panel"]}>
        <TopNavigationBar
          title={`Regelingen`}
          onBackArrowClick={handleBackClick}
          showSettings={false}
          showCta={true}
          onSettingsClick={() => {}}
          onSearch={handleSearch}
          onCtaClick={handleToggleAddRegulationModal}
          hasPermission={hasPermission}
          showSearch={false}
        />

        {regulations.length > 0 ? (
          <ul className={styles["regulation-list"]}>
            {regulations.map((regulation) => (
              <li
                key={regulation.id}
                className={`${styles["regulation-fade-in"]} ${styles["regulation-list-item"]}`}
                onClick={() => handleRegulationClick(regulation.id)}
              >
                <div className={styles["regulation-info"]}>
                  {regulation.name}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles["loading-container"]}>
            <LoadingDot delay={0} />
            <LoadingDot delay={0.1} />
            <LoadingDot delay={0.1} />
            <LoadingDot delay={0.2} />
            <LoadingDot delay={0.2} />
          </div>
        )}
      </div>
      <AddRegulationDesktop
        isOpen={isModalOpen}
        onClose={handleToggleAddRegulationModal}
        isBlockingInteraction={isBlockingInteraction}
        onRegulationAdded={handleRegulationAdded}
        sponsorId={sponsorId}
        refreshTrigger={refreshTrigger}
      />
      {selectedRegulationId && (
        <div className={styles["detail-panel"]}>
          <RegulationDetail
            regulationId={selectedRegulationId}
            isBlockingInteraction={false}
            onRegulationEdited={handleRegulationEdited}
            onRegulationDeleted={handleRegulationDeleted}
          />
        </div>
      )}
    </div>
  );
};

export default RegulationList;
