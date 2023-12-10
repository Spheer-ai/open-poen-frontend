import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import { deleteInitiative } from "../middleware/Api";

interface DeleteFundProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onFundDeleted: () => void;
  initiativeId: string;
  authToken: string;
}

const DeleteFund: React.FC<DeleteFundProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  onFundDeleted,
  initiativeId,
  authToken,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const [apiError, setApiError] = useState("");

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
      await deleteInitiative(authToken, initiativeId);
      setApiError("");
      handleClose();
      onFundDeleted();
    } catch (error) {
      console.error("Failed to delete fund:", error);
      if (error.response && error.response.status === 422) {
        setApiError("Validation Error");
      } else {
        setApiError("Failed to delete fund");
      }
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
        <h2 className={styles.title}>Initiatief verwijderen</h2>
        <hr></hr>
        <div className={styles.confirmation}>
          <p>Weet je zeker dat je het initatief wil verwijderen?</p>
        </div>
        {apiError && <p className={styles.error}>{apiError}</p>}
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

export default DeleteFund;
