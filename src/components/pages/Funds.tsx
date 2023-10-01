// Funds.js
import { useState } from "react";
import TopNavigationBar from "../ui/top-navigation-bar/TopNavigationBar";
import SlideInModal from "../modals/SlideInModal"; // Import your SlideInModal component
import styles from "../../assets/scss/Funds.module.scss";

export default function Funds() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCtaClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSearch = (query) => {
    console.log("Search query in UserDetailsPage:", query);
  };
  console.log("isModalOpen:", isModalOpen);
  return (
    <>
      <div className={styles["side-panel"]}>
        <TopNavigationBar
          title="Funds"
          showSettings={true}
          showCta={true}
          onSettingsClick={() => {}}
          onCtaClick={handleCtaClick}
          onSearch={handleSearch}
        />
      </div>
      <SlideInModal isOpen={isModalOpen} onClose={handleCloseModal}>
        <p>This is the modal content.</p>
      </SlideInModal>
    </>
  );
}
