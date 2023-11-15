import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import { addRegulation } from "../middleware/Api";

interface AddRegulationDesktopProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onRegulationAdded: () => void;
  sponsorId?: string;
  refreshTrigger: number;
}

const AddRegulationDesktop: React.FC<AddRegulationDesktopProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  onRegulationAdded,
  sponsorId,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const [regulationName, setRegulationName] = useState("");
  const [regulationDescription, setRegulationDescription] = useState("");
  const [nameError, setNameError] = useState(false);
  const [uniqueNameError, setUniqueNameError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);

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
    if (regulationName.trim() === "" && regulationDescription.trim() === "") {
      setNameError(true);
      setDescriptionError(true);
      setUniqueNameError(false);
      return;
    }

    if (regulationName.trim() === "") {
      setNameError(true);
      setDescriptionError(false);
      setUniqueNameError(false);
      return;
    }

    if (regulationDescription.trim() === "") {
      setDescriptionError(true);
      setNameError(false);
      setUniqueNameError(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is not available in localStorage");
        return;
      }

      if (!sponsorId) {
        console.error("Sponsor ID is not available.");
        return;
      }

      await addRegulation(
        token,
        Number(sponsorId),
        regulationName,
        regulationDescription,
      );

      setNameError(false);
      setUniqueNameError(false);

      setRegulationName("");
      setRegulationDescription("");
      handleClose();

      onRegulationAdded();
    } catch (error) {
      console.error("Error object:", error);
      console.log("Error message:", error.message);
      console.error("Failed to create regulation:", error.message);
      if (error.message === "Naam is al in gebruik.") {
        setUniqueNameError(true);
        setNameError(false);
      } else {
        setDescriptionError(true);
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
        <h2 className={styles.title}>Regeling Aanmaken</h2>
        <hr></hr>
        <div className={styles.formGroup}>
          <h3>Info</h3>
          <label className={styles.label}>Naam:</label>
          <input
            type="text"
            placeholder="Voer een naam in"
            value={regulationName}
            onChange={(e) => {
              setRegulationName(e.target.value);
              setNameError(false);
              setUniqueNameError(false);
            }}
            onKeyPress={handleEnterKeyPress}
          />
          {nameError && (
            <span style={{ color: "red", display: "block", marginTop: "5px" }}>
              Vul een naam in.
            </span>
          )}
          {uniqueNameError && (
            <span style={{ color: "red", display: "block", marginTop: "5px" }}>
              Naam is al in gebruik.
            </span>
          )}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Beschrijving:</label>
          <input
            type="text"
            placeholder="Voer de beschrijving in"
            value={regulationDescription}
            onChange={(e) => {
              setRegulationDescription(e.target.value);
              setDescriptionError(false);
            }}
            onKeyPress={handleEnterKeyPress}
          />
          {descriptionError && (
            <span style={{ color: "red", display: "block", marginTop: "5px" }}>
              Vul een beschrijving in.
            </span>
          )}
        </div>
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

export default AddRegulationDesktop;
