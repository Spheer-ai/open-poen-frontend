import React, { useState } from "react";
import TopNavigationBar from "../TopnavigationBar";
import AddItemModal from "../modals/AddItemModal";

function Transactions() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCtaClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <TopNavigationBar
        title="Transactions"
        showSettings={true} // Set to true to display settings button
        showCta={true} // Set to true to display call-to-action button
        onSettingsClick={() => {}}
        onCtaClick={handleCtaClick}
      />
      {/* Rest of your page content */}

      <AddItemModal isOpen={isModalOpen} onClose={handleCloseModal}>
        {/* Content for the modal */}
        <p>This is the modal content.</p>
      </AddItemModal>
    </div>
  );
}

export default Transactions;
