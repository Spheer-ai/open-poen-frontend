import React, { useState, useEffect } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import { editGrant } from "../middleware/Api";
import CloseIson from "/close-icon.svg";

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
  const [nameError, setNameError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [referenceError, setReferenceError] = useState<string | null>(null);
  const [budgetError, setBudgetError] = useState<string | null>(null);

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

  useEffect(() => {
    setNameError(null);
    setReferenceError(null);
    setBudgetError(null);
    setApiError(null);
  }, [grantName, grantReference, grantBudget]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleEdit();
    }
  };

  const handleEdit = async () => {
    try {
      if (grantName.trim() === "") {
        setNameError("Vul een naam in.");
        return;
      }

      if (grantReference.trim() === "") {
        setReferenceError("Vul een referentie in.");
        return;
      }

      if (grantBudget < 0 || grantBudget === 0 || grantBudget > 999999) {
        setBudgetError(
          grantBudget < 0
            ? "Begroting mag niet negatief zijn."
            : grantBudget === 0
            ? "Vul een begroting in."
            : "Het bedrag is te hoog, vul een lager bedrag in.",
        );
        return;
      }

      const token = localStorage.getItem("token");
      if (!token || !sponsorId || !regulationId || !grantId) {
        throw new Error(
          "Token, Sponsor ID, Regulation ID, or Grant ID is not available.",
        );
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
      if (error.response) {
        if (error.response.status === 500) {
          setReferenceError(
            "Referentie is al in gebruik. Kies een andere referentie.",
          );
        } else if (error.response.status === 409) {
          setNameError("Naam is al in gebruik. Gebruik een andere naam.");
        } else {
          setNameError("Naam is al in gebruik. Gebruik een andere naam.");
        }
      } else {
        setReferenceError(
          "Referentie is al in gebruik. Kies een andere referentie.",
        );
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
        <div className={styles.formTop}>
          <h2 className={styles.title}>Beschikking bewerken</h2>
          <button onClick={handleClose} className={styles.closeBtn}>
            <img src={CloseIson} alt="" />
          </button>
        </div>
        <hr></hr>
        <div className={styles.formGroup} style={{ margin: "10px 20px" }}>
          <h3>Info</h3>
          <label className={styles.label}>Referentie:</label>
          <input
            type="text"
            value={grantReference}
            onChange={(e) => setGrantReference(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          {referenceError && (
            <span style={{ color: "red", display: "block", marginTop: "5px" }}>
              {referenceError}
            </span>
          )}
          {apiError && (
            <span style={{ color: "red", display: "block", marginTop: "5px" }}>
              {apiError}
            </span>
          )}
        </div>
        <div className={styles.formGroup} style={{ margin: "10px 20px" }}>
          <label className={styles.label}>Naam:</label>
          <input
            type="text"
            value={grantName}
            onChange={(e) => setGrantName(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          {nameError && (
            <span style={{ color: "red", display: "block", marginTop: "5px" }}>
              {nameError}
            </span>
          )}
        </div>
        <div className={styles.formGroup} style={{ margin: "10px 20px" }}>
          <label className={styles.label}>Begroting:</label>
          <input
            type="number"
            value={grantBudget.toString()}
            onChange={(e) => setGrantBudget(Number(e.target.value))}
            onKeyPress={handleKeyPress}
          />
          {budgetError && (
            <span style={{ color: "red", display: "block", marginTop: "5px" }}>
              {budgetError}
            </span>
          )}
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
