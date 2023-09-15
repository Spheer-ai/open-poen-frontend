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

  return (
    <div className="side-panel">
      <TopNavigationBar
        title="Cards"
        showSettings={true}
        showCta={true}
        onSettingsClick={() => {}}
        onCtaClick={handleCtaClick}
      />

      <AddItemModal isOpen={isModalOpen} onClose={handleCloseModal}>
        <p>This is the modal content.</p>
      </AddItemModal>
    </div>
  );
}

export default Cards;
