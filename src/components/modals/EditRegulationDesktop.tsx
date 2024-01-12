import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import { updateRegulationDetails } from "../middleware/Api";

interface EditRegulationDesktopProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onRegulationEdited: () => void;
  sponsorId?: string;
  regulationId?: string;
  refreshTrigger: number;
  currentName: string;
  currentDescription: string;
}

const EditRegulationDesktop: React.FC<EditRegulationDesktopProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  onRegulationEdited,
  sponsorId,
  regulationId,
  currentName,
  currentDescription,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const [regulationName, setRegulationName] = useState(currentName);
  const [regulationDescription, setRegulationDescription] =
    useState(currentDescription);
  const [nameError, setNameError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [charCount, setCharCount] = useState(currentDescription.length);
  const [apiError, setApiError] = useState("");
  const [maxNameLength] = useState(128);

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
    setRegulationName(currentName);
    setRegulationDescription(currentDescription);
  }, [currentName, currentDescription]);

  const handleSave = async () => {
    if (regulationName.trim() === "" && regulationDescription.trim() === "") {
      setNameError(true);
      setDescriptionError(true);
      return;
    }

    if (regulationName.trim() === "") {
      setNameError(true);
      setDescriptionError(false);
      return;
    }

    if (regulationDescription.trim() === "") {
      setDescriptionError(true);
      setNameError(false);
      return;
    }

    if (regulationName.length > maxNameLength) {
      setNameError(true);
      setDescriptionError(false);
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

      await updateRegulationDetails(
        token,
        Number(sponsorId),
        Number(regulationId),
        regulationName,
        regulationDescription,
      );

      setNameError(false);
      setDescriptionError(false);
      setApiError("");

      handleClose();
      onRegulationEdited();
    } catch (error) {
      console.error("Failed to edit regulation:", error);
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

  const handleEnterKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const description = e.target.value;
    setRegulationDescription(description);
    setCharCount(description.length);
    setDescriptionError(false);
    setApiError("");
  };

  const isCharCountExceeded = charCount > 512;

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
        <h2 className={styles.title}>Regeling Bewerken</h2>
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
              setApiError("");
            }}
            onKeyPress={handleEnterKeyPress}
          />
          {nameError && regulationName.length > maxNameLength && (
            <span style={{ color: "red", display: "block", marginTop: "5px" }}>
              Naam mag niet meer dan {maxNameLength} karakters bevatten.
            </span>
          )}

          {nameError && regulationName.length <= maxNameLength && (
            <span style={{ color: "red", display: "block", marginTop: "5px" }}>
              Vul een naam in.
            </span>
          )}
          {apiError && (
            <span style={{ color: "red", display: "block", marginTop: "5px" }}>
              {apiError}
            </span>
          )}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Beschrijving:</label>
          <textarea
            placeholder="Voer de beschrijving in"
            value={regulationDescription}
            onChange={handleDescriptionChange}
          />
          {descriptionError && (
            <span style={{ color: "red", display: "block", marginTop: "5px" }}>
              Vul een beschrijving in.
            </span>
          )}
          <div className={styles.characterCounter}>
            <span
              style={{
                color: isCharCountExceeded ? "red" : "inherit",
                fontSize: "14px",
              }}
            >{`${charCount} / 512`}</span>
            {charCount > 512 && (
              <span
                style={{
                  fontSize: "14px",
                  color: isCharCountExceeded ? "red" : "inherit",
                }}
              >
                Beschrijving mag maximaal 512 tekens bevatten.
              </span>
            )}
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button onClick={handleClose} className={styles.cancelButton}>
            Annuleren
          </button>
          <button onClick={handleSave} className={styles.saveButton}>
            Bijwerken
          </button>
        </div>
      </div>
    </>
  );
};

export default EditRegulationDesktop;
