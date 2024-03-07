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
  const [nameError, setNameError] = useState(false);
  const [apiError, setApiError] = useState("");
  const [referenceError, setReferenceError] = useState(false);
  const [budgetError, setBudgetError] = useState(false);

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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleEdit();
    }
  };

  const handleEdit = async () => {
    if (grantName.trim() === "") {
      setNameError(true);
      setApiError("");
      return;
    }

    if (grantReference.trim() === "") {
      setReferenceError(true);
      setApiError("");
      if (grantBudget < 0 || grantBudget === 0 || grantBudget > 999999) {
        setBudgetError(true);
        setApiError(
          grantBudget < 0
            ? "Begroting mag niet negatief zijn"
            : grantBudget === 0
            ? "Vul een begroting in"
            : "Het bedrag is te hoog, vul een lager bedrag in",
        );
      } else {
        setBudgetError(false);
      }
      return;
    }

    if (grantBudget < 0 || grantBudget === 0 || grantBudget > 999999) {
      setBudgetError(true);
      setApiError(
        grantBudget < 0
          ? "Begroting mag niet negatief zijn"
          : grantBudget === 0
          ? "Vul een begroting in"
          : "Het bedrag is te hoog, vul een lager bedrag in",
      );
      if (referenceError) {
        setReferenceError(false);
      }
      return;
    }

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

      setNameError(false);
      setReferenceError(false);
      setBudgetError(false);
      setApiError("");

      handleClose();
      onGrantEdited();
    } catch (error) {
      console.error("Failed to edit grant:", error);
      if (error.response && error.response.status === 409) {
        setApiError("Naam is al in gebruik");
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
        <h2 className={styles.title}>Beschikking bewerken</h2>
        <hr></hr>
        <div className={styles.formGroup} style={{ margin: "10px 20px" }}>
          <h3>Info</h3>
          <label className={styles.label}>Referentie:</label>
          <input
            type="text"
            value={grantReference}
            onChange={(e) => {
              setGrantReference(e.target.value);
              setReferenceError(false);
              setApiError("");
            }}
            onKeyPress={handleKeyPress}
          />
          {referenceError && (
            <span style={{ color: "red", display: "block", marginTop: "5px" }}>
              Vul een referentie in.
            </span>
          )}
          {apiError && !budgetError && (
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
            onChange={(e) => {
              setGrantName(e.target.value);
              setNameError(false);
              setApiError("");
            }}
            onKeyPress={handleKeyPress}
          />
          {nameError && (
            <span style={{ color: "red", display: "block", marginTop: "5px" }}>
              Vul een naam in.
            </span>
          )}
          {apiError && !budgetError && (
            <span style={{ color: "red", display: "block", marginTop: "5px" }}>
              {apiError}
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
              {apiError}
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
