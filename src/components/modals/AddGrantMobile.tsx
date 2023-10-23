import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundModal.module.scss";
import { addGrant } from "../middleware/Api";

interface AddGrantMobileProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onGrantAdded: () => void;
  sponsorId?: string;
  regulationId?: string;
  refreshTrigger: number;
}

const AddGrantMobile: React.FC<AddGrantMobileProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  onGrantAdded,
  sponsorId,
  regulationId,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const [grantName, setGrantName] = useState("");
  const [grantReference, setGrantReference] = useState("");
  const [grantBudget, setGrantBudget] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setModalIsOpen(true);
    } else {
      setTimeout(() => {
        setModalIsOpen(false);
      }, 300);
    }
  }, [isOpen]);

  const handleAdd = async () => {
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

      await addGrant(
        token,
        Number(sponsorId),
        Number(regulationId),
        grantName,
        grantReference,
        grantBudget,
      );
      handleClose();
      onGrantAdded();
    } catch (error) {
      console.error("Failed to add grant:", error);
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
        <h2 className={styles.title}>Beschikking aanmaken</h2>
        <hr></hr>
        <div className={styles.formGroup}>
          <h3>Info</h3>
          <label className={styles.label}>Naam:</label>
          <input
            type="text"
            placeholder="Vul een naam in"
            value={grantName}
            onChange={(e) => setGrantName(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Referentie:</label>
          <input
            type="text"
            placeholder="Vul een referentie in"
            value={grantReference}
            onChange={(e) => setGrantReference(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Begroting:</label>
          <input
            type="number"
            placeholder="Vul een begroting in"
            value={grantBudget}
            onChange={(e) => setGrantBudget(Number(e.target.value))}
          />
        </div>
        <div className={styles.buttonContainer}>
          <button onClick={handleClose} className={styles.cancelButton}>
            Annuleren
          </button>
          <button onClick={handleAdd} className={styles.saveButton}>
            Opslaan
          </button>
        </div>
      </div>
    </>
  );
};

export default AddGrantMobile;
