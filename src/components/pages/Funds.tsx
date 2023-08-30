import React, { useState } from "react";
import TopNavigationBar from "../TopnavigationBar";
import AddItemModal from "../modals/AddItemModal";

function Funds() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCtaClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  return <div>
          <TopNavigationBar
        title="Funds"
        showSettings={true} // Set to true to display settings button
        showCta={true} // Set to true to display call-to-action button
        onSettingsClick={() => {}}
        onCtaClick={handleCtaClick}
      />

      {/* Your page content here */}

      <AddItemModal isOpen={isModalOpen} onClose={handleCloseModal}>
        {/* Content for the modal */}
        <p>This is the modal content.</p>
      </AddItemModal>
    </div>
};

export default Funds;
