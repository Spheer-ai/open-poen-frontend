import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import { addGrant } from "../middleware/Api";
import CloseIson from "/close-icon.svg";

interface AddGrantDesktopProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onGrantAdded: (newGrantId: number) => void;
  sponsorId?: string;
  regulationId?: string;
  refreshTrigger: number;
}

const AddGrantDesktop: React.FC<AddGrantDesktopProps> = ({
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
  const [grantBudget, setGrantBudget] = useState("");
  const [nameError, setNameError] = useState("");
  const [referenceError, setReferenceError] = useState("");
  const [budgetError, setBudgetError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setModalIsOpen(true);
    } else {
      setTimeout(() => {
        setModalIsOpen(false);
        setGrantReference("");
        setBudgetError("");
        setGrantName("");
        setNameError("");
        setGrantBudget("");
        setModalIsOpen(false);
      }, 300);
    }
  }, [isOpen]);

  const validateFields = () => {
    let isValid = true;

    if (!grantName) {
      setNameError("Vul een naam in.");
      isValid = false;
    } else {
      setNameError("");
    }

    if (!grantReference) {
      setReferenceError("Vul een referentie in.");
      isValid = false;
    } else {
      setReferenceError("");
    }

    if (!grantBudget) {
      setBudgetError("Vul een begroting in.");
      isValid = false;
    } else {
      const budgetValue = parseFloat(grantBudget);
      if (budgetValue < 0) {
        setBudgetError("Begroting mag niet negatief zijn.");
        isValid = false;
      } else if (budgetValue === 0) {
        setBudgetError("Vul een begroting in.");
        isValid = false;
      } else if (budgetValue > 999999) {
        setBudgetError("Het bedrag is te hoog, vul een lager bedrag in.");
        isValid = false;
      } else {
        setBudgetError("");
      }
    }

    return isValid;
  };

  const handleAdd = async () => {
    if (!validateFields()) {
      return;
    }

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

      const budget = parseFloat(grantBudget);

      const newGrantId = await addGrant(
        token,
        Number(sponsorId),
        Number(regulationId),
        grantName,
        grantReference,
        budget,
      );

      handleClose();
      onGrantAdded(newGrantId);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 500) {
          setReferenceError(
            "Het maken van de beschikking is mislukt. Controleer of de referentie al in gebruik is.",
          );
        } else if (error.response.status === 409) {
          setNameError("Naam is reeds in gebruik. Kies een andere naam.");
        } else {
          setNameError("Naam is reeds in gebruik. Kies een andere naam.");
        }
      } else {
        setReferenceError(
          "Het maken van de beschikking is mislukt. Controleer of de referentie al in gebruik is.",
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
          <h2 className={styles.title}>Beschikking aanmaken</h2>
          <button onClick={handleClose} className={styles.closeBtn}>
            <img src={CloseIson} alt="" />
          </button>
        </div>
        <hr></hr>
        <div className={styles.formGroup} style={{ margin: "0px 20px" }}>
          <h3>Info</h3>
          <label className={styles.label}>Referentie:</label>
          <input
            type="text"
            placeholder="Vul een referentie in"
            value={grantReference}
            onChange={(e) => setGrantReference(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleAdd();
              }
            }}
          />
          <p style={{ color: "red", display: "block", marginTop: "5px" }}>
            {referenceError}
          </p>
        </div>
        <div className={styles.formGroup} style={{ margin: "0px 20px" }}>
          <label className={styles.label}>Naam:</label>
          <input
            type="text"
            placeholder="Vul een naam in"
            value={grantName}
            onChange={(e) => setGrantName(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleAdd();
              }
            }}
          />
          <p style={{ color: "red", display: "block", marginTop: "5px" }}>
            {nameError}
          </p>
        </div>
        <div className={styles.formGroup} style={{ margin: "0px 20px" }}>
          <label className={styles.label}>Begroting:</label>
          <input
            type="number"
            placeholder="Vul een begroting in"
            value={grantBudget}
            onChange={(e) => setGrantBudget(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleAdd();
              }
            }}
          />
          <p style={{ color: "red", display: "block", marginTop: "5px" }}>
            {budgetError}
          </p>
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

export default AddGrantDesktop;
