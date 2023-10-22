import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundModal.module.scss";
import { addRegulation } from "../middleware/Api";

interface AddRegulationMobileProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onRegulationAdded: () => void;
  sponsorId?: string;
  refreshTrigger: number;
}

const AddRegulationMobile: React.FC<AddRegulationMobileProps> = ({
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
    console.log("Component rendered with isOpen:", isOpen);
    if (isOpen) {
      setModalIsOpen(true);
    } else {
      console.log("Closing modal");
      setTimeout(() => {
        console.log("Modal closed with modalIsOpen:", modalIsOpen);
        setModalIsOpen(false);
      }, 150);
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
        console.error("Sponsor ID is not defined.");
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
    console.log("Modal is not open");
    return null;
  }

  return (
    <>
      <div
        className={`${styles.backdrop} ${modalIsOpen ? styles.open : ""}`}
        onClick={handleClose}
      ></div>
      <div className={`${styles.modal} ${modalIsOpen ? styles.open : ""}`}>
        <h2 className={styles.title}>Regeling aanmaken</h2>
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
            Opslaan
          </button>
        </div>
      </div>
    </>
  );
};

export default AddRegulationMobile;
