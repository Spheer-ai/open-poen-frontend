// AddOfficerDesktop.tsx

import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundModal.module.scss";
import { addOfficerToGrant } from "../middleware/Api"; // Make sure you have this function available
import { Officer } from "../../types/AddOfficerType";

interface AddOfficerDesktopProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onOfficerAdded: () => void;
  sponsorId?: string;
  regulationId?: string;
  grantId?: string;
  officers: Officer[]; // A list of available officers to be added
}

const AddOfficerDesktop: React.FC<AddOfficerDesktopProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  onOfficerAdded,
  sponsorId,
  regulationId,
  grantId,
  officers,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const [selectedOfficerId, setSelectedOfficerId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (isOpen) {
      setModalIsOpen(true);
    } else {
      setTimeout(() => {
        setModalIsOpen(false);
      }, 300);
    }
  }, [isOpen]);

  const handleAddOfficer = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is not available in localStorage");
        return;
      }

      if (!sponsorId || !regulationId || !grantId || !selectedOfficerId) {
        console.error("Required IDs are not available.");
        return;
      }

      await addOfficerToGrant(
        token,
        Number(sponsorId),
        Number(regulationId),
        Number(grantId),
        [selectedOfficerId],
      );
      handleClose();
      onOfficerAdded();
    } catch (error) {
      console.error("Failed to add officer:", error);
    }
  };

  const handleClose = () => {
    if (!isBlockingInteraction) {
      setModalIsOpen(false);
      onClose();
    }
  };

  if (!isOpen && !modalIsOpen) {
    return null;
  }

  return (
    <>
      <div
        className={`${styles.backdrop} ${modalIsOpen ? styles.open : ""}`}
        onClick={handleClose}
      ></div>
      <div className={`${styles.modal} ${modalIsOpen ? styles.open : ""}`}>
        <h2 className={styles.title}>Officer Toevoegen</h2>
        <hr></hr>
        <div className={styles.formGroup}>
          <label className={styles.label}>Kies een Officer:</label>
          <select
            value={selectedOfficerId || ""}
            onChange={(e) => setSelectedOfficerId(Number(e.target.value))}
          >
            {officers.map((officer) => (
              <option key={officer.id} value={officer.id}>
                {officer.first_name} {officer.last_name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.buttonContainer}>
          <button onClick={handleClose} className={styles.cancelButton}>
            Annuleren
          </button>
          <button onClick={handleAddOfficer} className={styles.saveButton}>
            Toevoegen
          </button>
        </div>
      </div>
    </>
  );
};

export default AddOfficerDesktop;
