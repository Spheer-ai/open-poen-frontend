import React, { useState } from "react";
import TopNavigationBar from "../TopNavigationBar";
import AddItemModal from "../modals/AddItemModal";

function Funds() {
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
        title="Funds"
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

export default Funds;
