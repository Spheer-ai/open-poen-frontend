import React, { useEffect, useState } from "react";
import TopNavigationBar from "../ui/top-navigation-bar/TopNavigationBar";
import styles from "../../assets/scss/Sponsors.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import AddSponsorMobile from "../modals/AddSponsorMobile";
import AddSponsorDesktop from "../modals/AddSponsorDesktop";
import SponsorList from "../lists/SponsorsList";
import { usePermissions } from "../../contexts/PermissionContext";
import RegulationList from "../lists/RegulationList";
import { useAuth } from "../../contexts/AuthContext";

export default function Sponsors() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { action, sponsorId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(action === "add-sponsor");
  const [showPageContent, setShowPageContent] = useState(!!sponsorId);
  const [isBlockingInteraction, setIsBlockingInteraction] = useState(false);
  const [isRegulationListVisible, setIsRegulationListVisible] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const isMobileScreen = window.innerWidth < 768;
  const { fetchPermissions } = usePermissions();
  const [permissionsFetched, setPermissionsFetched] = useState(false);
  const [entityPermissions, setEntityPermissions] = useState<string[]>([]);
  const hasPermission = entityPermissions.includes("create");

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

  const handleSearch = (query) => {
    console.log("Search query in UserDetailsPage:", query);
  };

  const handleShowPageContent = (sponsorId) => {
    if (sponsorId !== undefined) {
      setIsRegulationListVisible(true);
      setShowPageContent(true);
      navigate(`/sponsors/detail/${sponsorId}`);
    } else {
      alert("Sponsor ID not available.");
    }
  };

  const handleToggleAddSponsorModal = () => {
    if (isModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsModalOpen(false);
        navigate("/sponsors");
      }, 300);
    } else {
      setIsModalOpen(true);
      navigate("/sponsors/add-sponsor");
    }
  };

  const handleSponsorAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };
  return (
    <>
      <div className={styles["side-panel"]}>
        {!isRegulationListVisible && (
          <TopNavigationBar
            title="Sponsors"
            showSettings={true}
            showCta={true}
            onSettingsClick={() => {}}
            onCtaClick={handleToggleAddSponsorModal}
            onSearch={handleSearch}
            hasPermission={hasPermission}
          />
        )}
        {sponsorId ? (
          <RegulationList />
        ) : (
          <SponsorList
            onShowPageContent={handleShowPageContent}
            refreshTrigger={refreshTrigger}
          />
        )}
      </div>
      {isMobileScreen ? (
        <AddSponsorMobile
          isOpen={isModalOpen}
          onClose={handleToggleAddSponsorModal}
          isBlockingInteraction={isBlockingInteraction}
          onSponsorAdded={handleSponsorAdded}
        />
      ) : (
        <AddSponsorDesktop
          isOpen={isModalOpen}
          onClose={handleToggleAddSponsorModal}
          isBlockingInteraction={isBlockingInteraction}
          onSponsorAdded={handleSponsorAdded}
        />
      )}
    </>
  );
}
