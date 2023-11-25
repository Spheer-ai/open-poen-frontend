import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import { deleteSponsor } from "../middleware/Api";

interface DeleteSponsorProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onSponsorDeleted: () => void;
  sponsorId?: string;
}

const DeleteSponsor: React.FC<DeleteSponsorProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  onSponsorDeleted,
  sponsorId,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setModalIsOpen(true);
    } else {
      setTimeout(() => {
        setModalIsOpen(false);
      }, 300);
    }
  }, [isOpen]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is not available in localStorage");
        return;
      }
      if (!sponsorId) {
        console.error("Sponsor ID is missing");
        return;
      }
      await deleteSponsor(token, Number(sponsorId)); // Use sponsorId to delete the sponsor
      handleClose();
      onSponsorDeleted();
    } catch (error) {
      console.error("Failed to delete sponsor:", error);
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
        <h2 className={styles.title}>Sponsor Verwijderen</h2>
        <hr />
        <div className={styles.formGroup}>
          <h3>Info</h3>
          <p>Weet je zeker dat je deze sponsor wil verwijderen?</p>
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

export default DeleteSponsor;
