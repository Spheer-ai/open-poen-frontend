import React, { useState } from "react";
import TopNavigationBar from "../../components/TopNavigationBar";
import AddItemModal from "../modals/AddItemModal";

function Cards() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCtaClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleSearch = (query) => {
    // Handle the search logic specific to this component
    console.log("Search query in UserDetailsPage:", query);
  };
  return (
    <div className="side-panel">
      <TopNavigationBar
        title="Cards"
        showSettings={true}
        showCta={true}
        onSettingsClick={() => {}}
        onCtaClick={handleCtaClick}
        onSearch={handleSearch}
      />

      <AddItemModal isOpen={isModalOpen} onClose={handleCloseModal}>
        <p>This is the modal content.</p>
      </AddItemModal>
    </div>
  );
}

export default Cards;
