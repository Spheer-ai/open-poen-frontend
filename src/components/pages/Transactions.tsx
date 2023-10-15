import React, { useState } from "react";
import TopNavigationBar from "../ui/top-navigation-bar/TopNavigationBar";
import AddItemModal from "../modals/AddItemModal";
import styles from "../../assets/scss/Transactions.module.scss";
import { usePermissions } from "../../contexts/PermissionContext";

export default function Transactions() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCtaClick = () => {
    setIsModalOpen(true);
    console.log("Opening modal in Transactions component");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    console.log("Closing modal in Transactions component");
  };

  const handleSearch = (query) => {
    console.log("Search query in Transactions component:", query);
  };

  const { permissions } = usePermissions();

  return (
    <div className={styles["side-panel"]}>
      <TopNavigationBar
        title="Transacties"
        showSettings={true}
        showCta={true}
        onSettingsClick={() => {}}
        onCtaClick={handleCtaClick}
        onSearch={handleSearch}
        permissions={permissions}
      />

      <AddItemModal isOpen={isModalOpen} onClose={handleCloseModal}>
        <p>This is the modal content.</p>
      </AddItemModal>
    </div>
  );
}
