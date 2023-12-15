import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import { updateActivityOwners } from "../middleware/Api";

interface LinkActivityOwnerProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onActivityOwnerLinked: () => void;
  initiativeId: string;
  activityId: string;
  token: string;
}

const LinkFundOwner: React.FC<LinkActivityOwnerProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  onActivityOwnerLinked,
  initiativeId,
  activityId,
  token,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const [userIds, setUserIds] = useState([]);

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
      await updateActivityOwners(initiativeId, activityId, userIds, token);

      onActivityOwnerLinked();

      handleClose();
    } catch (error) {
      console.error("Error creating payment:", error);
    }
  };

  const handleClose = () => {
    if (!isBlockingInteraction) {
      setModalIsOpen(false);
      onClose();
    }
  };

  const handleEnterKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
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
        <h2 className={styles.title}>Activiteitnemer toevoegen</h2>
        <hr></hr>
        <div className={styles.formGroup}>
          <h3>Info</h3>
          <label className={styles.labelField}>Bedrag:</label>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelField}>Datum:</label>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelField}>Naam betaler:</label>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelField}>Naam ontvanger:</label>
        </div>
        <div className={styles.buttonContainer}>
          <button onClick={handleClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button onClick={handleSave} className={styles.saveButton}>
            Opslaan
          </button>
        </div>
      </div>
    </>
  );
};

export default LinkFundOwner;
