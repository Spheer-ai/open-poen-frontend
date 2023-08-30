import React, { useState } from "react";
import TopNavigationBar from "../../components/TopNavigationBar";
import AddItemModal from "../../components/modals/AddItemModal";
import AddUserForm from "../forms/AddUserForm";

function Contacts() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCtaClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleContinue = () => {
    // Handle the form submission
    // This can include validation and sending data to the server
    // After that, close the modal
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    // Handle cancel action
    setIsModalOpen(false);
  };

  return (
    <div>
      <TopNavigationBar
        title="Users"
        showSettings={true}
        showCta={true}
        onSettingsClick={() => {}}
        onCtaClick={handleCtaClick}
      />

      {/* Your page content here */}

      <AddItemModal isOpen={isModalOpen} onClose={handleCloseModal}>
        {/* Content for the modal */}
        <AddUserForm
  onContinue={() => {
    // Handle the continue action
    // This can include validation and sending data to the server
    // After that, close the modal
    setIsModalOpen(false);
  }}
  onCancel={handleCancel}
/>
      </AddItemModal>
    </div>
  );
}

export default Contacts;
