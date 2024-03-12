import React, { useState, useEffect } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import { deleteGrant } from "../middleware/Api";
import CloseIson from "/close-icon.svg";

type Grant = {
  name: string;
  reference: string;
  budget: number;
  income: number;
  id: number;
  expenses: number;
};

interface DeleteGrantProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onGrantDeleted: () => void;
  sponsorId?: string;
  regulationId?: string;
  grantId?: string;
  currentName: string;
  currentReference: string;
  currentBudget: number;
  grant: Grant | null;
}

const DeleteGrant: React.FC<DeleteGrantProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  onGrantDeleted,
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

      if (!sponsorId || !regulationId || !grantId) {
        console.error(
          "Sponsor ID, Regulation ID, or Grant ID is not available.",
        );
        return;
      }

      await deleteGrant(
        token,
        Number(sponsorId),
        Number(regulationId),
        Number(grantId),
      );
      handleClose();
      onGrantDeleted();
    } catch (error) {
      console.error("Failed to delete grant:", error);
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
          <h2 className={styles.title}>Beschikking verwijderen</h2>
          <button onClick={handleClose} className={styles.closeBtn}>
            <img src={CloseIson} alt="" />
          </button>
        </div>
        <hr></hr>
        <div className={styles.formGroup}>
          <h3>Info</h3>
          <p>Weet je zeker dat je de beschikking wilt verwijderen?</p>
          <label className={styles.label}>Naam:</label>
          <span> {currentName}</span>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Referentie:</label>
          <span> {currentReference}</span>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Begroting:</label>
          <span>€ {currentBudget}</span>
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

export default DeleteGrant;
