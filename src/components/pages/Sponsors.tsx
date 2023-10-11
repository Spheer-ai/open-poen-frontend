import React, { useEffect, useState } from "react";
import TopNavigationBar from "../ui/top-navigation-bar/TopNavigationBar";
import styles from "../../assets/scss/Sponsors.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import AddSponsorMobile from "../modals/AddSponsorMobile";
import AddSponsorDesktop from "../modals/AddSponsorDesktop";
import SponsorList from "../lists/SponsorsList";

export default function Sponsors() {
  const navigate = useNavigate();
  const { action, sponsorId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(action === "add-sponsor");
  const [showPageContent, setShowPageContent] = useState(!!sponsorId);
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
    </>
  );
}
