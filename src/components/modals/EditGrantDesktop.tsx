import React, { useState, useEffect } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import { editGrant } from "../middleware/Api";

type Grant = {
  name: string;
  reference: string;
  budget: number;
  income: number;
  id: number;
  expenses: number;
};

interface EditGrantDesktopProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onGrantEdited: () => void;
  sponsorId?: string;
  regulationId?: string;
  grantId?: string;
  currentName: string;
  currentReference: string;
  currentBudget: number;
  grant: Grant | null;
}

const EditGrantDesktop: React.FC<EditGrantDesktopProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  onGrantEdited,
  sponsorId,
  regulationId,
  grant,
  currentName,
  currentReference,
  currentBudget,
}) => {
  let grantId: number | null = null;

  if (grant) {
    grantId = grant.id;
  }

  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const [grantName, setGrantName] = useState(currentName);
  const [grantReference, setGrantReference] = useState(currentReference);
  const [grantBudget, setGrantBudget] = useState(currentBudget);

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
    setGrantName(currentName);
    setGrantReference(currentReference);
    setGrantBudget(currentBudget);
  }, [currentName, currentReference, currentBudget]);

  const handleEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is not available in localStorage");
        return;
      }

      if (!sponsorId || !regulationId || !grantId) {
        console.error(
          "Sponsor ID, Regulation ID, or Grant ID is not available.",
        );
        return;
      }

      await editGrant(
        token,
        Number(sponsorId),
        Number(regulationId),
        Number(grantId),
        grantName,
        grantReference,
        grantBudget,
      );
      handleClose();
      onGrantEdited();
    } catch (error) {
      console.error("Failed to edit grant:", error);
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
        <h2 className={styles.title}>Beschikking bewerken</h2>
        <hr></hr>
        <div className={styles.formGroup}>
          <h3>Info</h3>
          <label className={styles.label}>Naam:</label>
          <input
            type="text"
            value={grantName}
            onChange={(e) => setGrantName(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Referentie:</label>
          <input
            type="text"
            value={grantReference}
            onChange={(e) => setGrantReference(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Begroting:</label>
          <input
            type="number"
            value={grantBudget.toString()}
            onChange={(e) => setGrantBudget(Number(e.target.value))}
          />
        </div>
        <div className={styles.buttonContainer}>
          <button onClick={handleClose} className={styles.cancelButton}>
            Annuleren
          </button>
          <button onClick={handleEdit} className={styles.saveButton}>
            Bewerken
          </button>
        </div>
      </div>
    </>
  );
};

export default EditGrantDesktop;
