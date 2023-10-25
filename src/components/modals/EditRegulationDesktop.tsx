import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import { updateRegulationDetails } from "../middleware/Api";

interface EditRegulationDesktopProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onRegulationEdited: () => void;
  sponsorId?: string;
  regulationId?: string;
  refreshTrigger: number;
  currentName: string;
  currentDescription: string;
}

const EditRegulationDesktop: React.FC<EditRegulationDesktopProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  onRegulationEdited,
  sponsorId,
  regulationId,
  currentName,
  currentDescription,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const [regulationName, setRegulationName] = useState(currentName);
  const [regulationDescription, setRegulationDescription] =
    useState(currentDescription);

  useEffect(() => {
    if (isOpen) {
      setModalIsOpen(true);
    } else {
      setTimeout(() => {
        setModalIsOpen(false);
      }, 300);
    }
  }, [isOpen]);

  useEffect(() => {
    setRegulationName(currentName);
    setRegulationDescription(currentDescription);
  }, [currentName, currentDescription]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is not available in localStorage");
        return;
      }

      if (!sponsorId || !regulationId) {
        console.error("Sponsor ID or Regulation ID is not available.");
        return;
      }

      await updateRegulationDetails(
        token,
        Number(sponsorId),
        Number(regulationId),
        regulationName,
        regulationDescription,
      );
      handleClose();
      onRegulationEdited();
    } catch (error) {
      console.error("Failed to edit regulation:", error);
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
        <h2 className={styles.title}>Regeling Bewerken</h2>
        <hr></hr>
        <div className={styles.formGroup}>
          <h3>Info</h3>
          <label className={styles.label}>Naam:</label>
          <input
            type="text"
            placeholder="Voer een naam in"
            value={regulationName}
            onChange={(e) => setRegulationName(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Beschrijving:</label>
          <textarea
            placeholder="Voer de beschrijving in"
            value={regulationDescription}
            onChange={(e) => setRegulationDescription(e.target.value)}
          />
        </div>
        <div className={styles.buttonContainer}>
          <button onClick={handleClose} className={styles.cancelButton}>
            Annuleren
          </button>
          <button onClick={handleSave} className={styles.saveButton}>
            Bijwerken
          </button>
        </div>
      </div>
    </>
  );
};

export default EditRegulationDesktop;
