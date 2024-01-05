import React, { useEffect, useState } from "react";
import TopNavigationBar from "../ui/top-navigation-bar/TopNavigationBar";
import styles from "../../assets/scss/Sponsors.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import AddSponsorMobile from "../modals/AddSponsorMobile";
import AddSponsorDesktop from "../modals/AddSponsorDesktop";
import SponsorList from "../lists/SponsorsList";
import { usePermissions } from "../../contexts/PermissionContext";
import RegulationList from "../lists/RegulationList";

export default function Sponsors() {
  const navigate = useNavigate();
  const { action, sponsorId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(action === "add-sponsor");
  const [showPageContent, setShowPageContent] = useState(!!sponsorId);
  const [isBlockingInteraction, setIsBlockingInteraction] = useState(false);
  const [isRegulationListVisible, setIsRegulationListVisible] = useState(false);
  const { globalPermissions } = usePermissions();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const isMobileScreen = window.innerWidth < 768;

  useEffect(() => {
    if (action === "add-sponsor") {
      setIsModalOpen(true);
    }
  }, [action]);

  const handleSearch = (query) => {};

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
            globalPermissions={globalPermissions}
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
