import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import { addRegulation } from "../middleware/Api";

interface AddRegulationDesktopProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onRegulationAdded: () => void;
  sponsorId?: string;
  refreshTrigger: number;
}

const AddRegulationDesktop: React.FC<AddRegulationDesktopProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  onRegulationAdded,
  sponsorId,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const [regulationName, setRegulationName] = useState("");
  const [regulationDescription, setRegulationDescription] = useState("");

  useEffect(() => {
    if (isOpen) {
      setModalIsOpen(true);
    } else {
      setTimeout(() => {
        setModalIsOpen(false);
      }, 300);
    }
  }, [isOpen]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is not available in localStorage");
        return;
      }

      if (!sponsorId) {
        console.error("Sponsor ID is not available.");
        return;
      }

      await addRegulation(
        token,
        Number(sponsorId),
        regulationName,
        regulationDescription,
      );
      setRegulationName("");
      setRegulationDescription("");
      handleClose();

      onRegulationAdded();
    } catch (error) {
      console.error("Failed to create regulation:", error);
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
        <h2 className={styles.title}>Regeling Aanmaken</h2>
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
          <input
            type="text"
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
            Opslaan
          </button>
        </div>
      </div>
    </>
  );
};

export default AddRegulationDesktop;
