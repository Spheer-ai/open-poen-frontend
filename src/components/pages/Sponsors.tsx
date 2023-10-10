import React, { useEffect, useState } from "react";
import TopNavigationBar from "../ui/top-navigation-bar/TopNavigationBar";
import styles from "../../assets/scss/Sponsors.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import AddSponsorMobile from "../modals/AddSponsorMobile";
import AddSponsorDesktop from "../modals/AddSponsorDesktop";
import PageContent from "../ui/layout/PageContent";
import SponsorList from "../lists/SponsorsList";
import SponsorDetail from "./SponsorDetail"; // Import the SponsorDetail component

export default function Sponsors() {
  const navigate = useNavigate();
  const { action, sponsorId } = useParams(); // Extract sponsorId and action from the URL
  const [isModalOpen, setIsModalOpen] = useState(action === "add-sponsor");
  const [showPageContent, setShowPageContent] = useState(!!sponsorId); // Initialize based on whether sponsorId is available
  const [isBlockingInteraction, setIsBlockingInteraction] = useState(false);

  const isMobileScreen = window.innerWidth < 768;

  useEffect(() => {
    console.log("action:", action);
    if (action === "add-sponsor") {
      setIsModalOpen(true);
    }
  }, [action]);

  const handleSearch = (query) => {
    console.log("Search query in UserDetailsPage:", query);
  };

  const handleShowPageContent = (sponsorId) => {
    if (sponsorId !== undefined) {
      setShowPageContent(true);
      navigate(`/sponsors/detail/${sponsorId}`);
    } else {
      // Handle the case when 'sponsorId' is not available, e.g., show a message
      alert("Sponsor ID not available.");
    }
  };

  const handleClosePageContent = () => {
    setShowPageContent(false);
    navigate("/sponsors");
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

  return (
    <>
      <div className={styles["side-panel"]}>
        <TopNavigationBar
          title="Sponsors"
          showSettings={true}
          showCta={true}
          onSettingsClick={() => {}}
          onCtaClick={handleToggleAddSponsorModal}
          onSearch={handleSearch}
        />
        <SponsorList onShowPageContent={handleShowPageContent} />
      </div>
      {isMobileScreen ? (
        <AddSponsorMobile
          isOpen={isModalOpen}
          onClose={handleToggleAddSponsorModal}
          isBlockingInteraction={isBlockingInteraction}
        />
      ) : (
        <AddSponsorDesktop
          isOpen={isModalOpen}
          onClose={handleToggleAddSponsorModal}
          isBlockingInteraction={isBlockingInteraction}
        />
      )}
      {showPageContent ? (
        <PageContent
          showContent={showPageContent}
          onClose={handleClosePageContent}
        >
          {/* Render the SponsorDetail component with the specific sponsorId */}
          <SponsorDetail />
        </PageContent>
      ) : (
        <div>No data loaded or message here.</div>
      )}
    </>
  );
}
