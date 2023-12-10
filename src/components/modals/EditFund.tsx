import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import { editFund } from "../middleware/Api";

interface FundDetails {
  id?: number;
  name?: string;
  description?: string;
  budget?: number;
  income?: number;
  expenses?: number;
}

interface EditFundProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onFundEdited: () => void;
  initiativeId: string;
  authToken: string;
  fundData: FundDetails | null;
}

const EditFund: React.FC<EditFundProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  onFundEdited,
  initiativeId,
  authToken,
  fundData,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const [isHiddenSponsors, setIsHiddenSponsors] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [apiError, setApiError] = useState("");
  const [formData, setFormData] = useState<FundDetails | null>(null);

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
    if (isOpen && fundData) {
      setFormData(fundData);
    }
  }, [isOpen, fundData]);

  const handleSave = async () => {
    try {
      const updatedFundData = {
        ...formData,
        hidden_sponsors: isHiddenSponsors,
        hidden: isHidden,
      };

      await editFund(authToken, initiativeId, updatedFundData);
      setApiError("");
      handleClose();
      onFundEdited();
    } catch (error) {
      console.error("Failed to edit fund:", error);
      if (error.response && error.response.status === 409) {
        setApiError("Name is already in use");
      }
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
      e.preventDefault();
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
        <h2 className={styles.title}>Beheer initiatief</h2>
        <hr></hr>
        <div className={styles.formGroup}>
          <h4>Algemene initiatiefinstellingen</h4>
          <label className={styles.label}>Naam:</label>
          <input
            type="text"
            placeholder="Naam"
            value={formData?.name || ""}
            onKeyPress={handleEnterKeyPress}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <label className={styles.label}>Beschrijving:</label>
          <textarea
            placeholder="Beschrijving"
            value={formData?.description || ""}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <div className={styles.roleOptions}>
            <label className={styles.roleLabel}>
              <input
                type="checkbox"
                checked={isHidden}
                onChange={() => setIsHidden(!isHidden)}
              />
              Initiatief verbergen
            </label>
            <label className={styles.roleLabel}>
              <input
                type="checkbox"
                checked={isHiddenSponsors}
                onChange={() => setIsHiddenSponsors(!isHiddenSponsors)}
              />
              Sponsors verbergen
            </label>
          </div>
          <label className={styles.labelField}>Begroting:</label>
          <input
            type="number"
            placeholder="Vul het begrootte bedrag in"
            name="budget"
            onKeyDown={handleEnterKeyPress}
            value={formData?.budget || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                budget: parseFloat(e.target.value) || 0,
              })
            }
          />
        </div>
        {apiError && <p className={styles.error}>{apiError}</p>}
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

export default EditFund;
