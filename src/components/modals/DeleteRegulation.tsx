import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import { deleteRegulation } from "../middleware/Api";
import useCachedImages from "../utils/images";

interface DeleteRegulationProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onRegulationDeleted: () => void;
  sponsorId?: string;
  regulationId?: string;
  refreshTrigger: number;
  currentName: string;
  currentDescription: string;
}

const DeleteRegulation: React.FC<DeleteRegulationProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  onRegulationDeleted,
  sponsorId,
  regulationId,
  currentName,
  currentDescription,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const [regulationName, setRegulationName] = useState(currentName);
  const images = useCachedImages(["close"]);
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

  const handleDelete = async () => {
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

      await deleteRegulation(token, Number(sponsorId), Number(regulationId));

      onClose();
      onRegulationDeleted();
    } catch (error) {
      console.error("Failed to delete regulation:", error);
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
        <div className={styles.formTop}>
          <h2 className={styles.title}>Regeling Verwijderen</h2>
          <button onClick={handleClose} className={styles.closeBtn}>
            <img src={images.close} alt="Close Icon" />
          </button>
        </div>
        <hr></hr>
        <div className={styles.formGroup}>
          <h3>Info</h3>
          <p>
            Je staat op het punt deze regeling te verwijderen. Dit kan niet
            ongedaan gemaakt worden. Weet je het zeker?
          </p>
          <div className={styles.deleteLabels}>
            <label className={styles.label}>Naam: </label>
            <p>{regulationName}</p>
            <label className={styles.label}>Beschrijving:</label>
            <p>{regulationDescription}</p>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button onClick={handleClose} className={styles.cancelButton}>
            Annuleren
          </button>
          <button onClick={handleDelete} className={styles.deleteButton}>
            Verwijderen
          </button>
        </div>
      </div>
    </>
  );
};

export default DeleteRegulation;
