import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopNavigationBar from "../ui/top-navigation-bar/TopNavigationBar";
import PageContent from "../ui/layout/PageContent";
import styles from "../../assets/scss/Funds.module.scss";
import AddFundModal from "../modals/AddFundMobile";

export default function Funds() {
  const navigate = useNavigate();
  const { action } = useParams(); // Get the route parameter "action"

  const [isModalOpen, setIsModalOpen] = useState(action === "add-funds");
  const [showPageContent, setShowPageContent] = useState(false);
  const [isBlockingInteraction, setIsBlockingInteraction] = useState(false); // State to block interactions

  const isMobileScreen = window.innerWidth < 768;

  useEffect(() => {
    console.log("action:", action); // Log the action parameter
    if (action === "add-funds") {
      setIsModalOpen(true);
    }
  }, [action]);

  const handleCloseModal = () => {
    setIsBlockingInteraction(true); // Block interactions during timeout
    setTimeout(() => {
      setIsBlockingInteraction(false); // Unblock interactions
      setIsModalOpen(false);
      navigate("/funds"); // Update the route when the modal is closed
    }, 150); // Adjust the delay time as needed
  };

  const handleSearch = (query) => {
    console.log("Search query in UserDetailsPage:", query);
  };

  const handleShowPageContent = () => {
    setShowPageContent(true);
    navigate("/funds/detail");
  };

  const handleClosePageContent = () => {
    setShowPageContent(false);
    navigate("/funds");
  };

  const handleToggleAddFundModal = () => {
    if (isModalOpen) {
      setIsBlockingInteraction(true); // Block interactions during timeout
      setTimeout(() => {
        setIsBlockingInteraction(false); // Unblock interactions
        setIsModalOpen(false);
        navigate("/funds"); // Update the route when the modal is closed
      }, 300); // Adjust the delay time as needed
    } else {
      setIsModalOpen(true); // Open the modal
      navigate("/funds/add-funds"); // Update the route to "/funds/add-funds"
    }
  };

  return (
    <>
      <div className={styles["side-panel"]}>
        <TopNavigationBar
          title="Initiatieven"
          showSettings={true}
          showCta={true}
          onSettingsClick={() => {}}
          onCtaClick={handleToggleAddFundModal}
          onSearch={handleSearch}
        />
      </div>

      {isMobileScreen ? (
        <AddFundModal
          isOpen={isModalOpen}
          onClose={handleToggleAddFundModal}
          isBlockingInteraction={isBlockingInteraction}
        />
      ) : (
        <>
          <h2>Add Fund</h2>
          {/* Add your form or content for adding a fund here */}
          <button onClick={handleCloseModal}>Close</button>
        </>
      )}

      <button onClick={handleShowPageContent}>
        {showPageContent ? "Close PageContent" : "Show PageContent"}
      </button>

      <button onClick={handleToggleAddFundModal}>Add Fund</button>

      {/* Conditionally render PageContent */}
      {showPageContent && (
        <PageContent
          showContent={showPageContent}
          onClose={handleClosePageContent}
        >
          {/* Add the content you want to show here */}
        </PageContent>
      )}
    </>
  );
}
