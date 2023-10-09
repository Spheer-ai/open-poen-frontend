import React, { useEffect, useState } from "react";
import TopNavigationBar from "../ui/top-navigation-bar/TopNavigationBar";
import styles from "../../assets/scss/Sponsors.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import AddSponsorMobile from "../modals/AddSponsorMobile";
import AddSponsorDesktop from "../modals/AddSponsorDesktop";
import PageContent from "../ui/layout/PageContent";

export default function Sponsors() {
  const navigate = useNavigate();
  const { action } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(action === "add-sponsor");
  const [showPageContent, setShowPageContent] = useState(false);
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

  const handleShowPageContent = () => {
    setShowPageContent(true);
    navigate("/sponsors/detail");
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
      <button onClick={handleShowPageContent}>
        {showPageContent ? "Close PageContent" : "Show PageContent"}
      </button>

      <button onClick={handleToggleAddSponsorModal}>Add Sponsor</button>
      {showPageContent && (
        <PageContent
          showContent={showPageContent}
          onClose={handleClosePageContent}
        >
        </PageContent>
      )}
    </>
  );
}
