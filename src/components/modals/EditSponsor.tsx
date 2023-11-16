import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import { editSponsor } from "../middleware/Api";

interface EditSponsorProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onSponsorEdited: () => void;
  sponsorId?: string;
  currentName: string;
  currentUrl: string;
  hasEditSponsorPermission: boolean;
}

const EditSponsor: React.FC<EditSponsorProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  onSponsorEdited,
  sponsorId,
  currentName,
  currentUrl,
  hasEditSponsorPermission,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const [funderName, setFunderName] = useState(currentName);
  const [funderUrl, setFunderUrl] = useState(currentUrl);
  const [isUrlValid, setIsUrlValid] = useState(true);
  const [nameError, setNameError] = useState(false);
  const [urlError, setUrlError] = useState(false);
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
    setFunderName(currentName);
    setFunderUrl(currentUrl);
  }, [currentName, currentUrl]);

  const validateUrl = (url) => {
    const urlPattern =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return urlPattern.test(url);
  };

  const handleSave = async () => {
    if (funderName.trim() === "" && funderUrl.trim() === "") {
      setNameError(true);
      setUrlError(true);
      return;
    }

    if (!validateUrl(funderUrl)) {
      setIsUrlValid(false);
      return;
    } else {
      setIsUrlValid(true);
    }

    if (funderName.trim() === "") {
      setNameError(true);
      return;
    } else {
      setNameError(false);
    }

    if (funderName.length > maxNameLength) {
      setNameError(true);
      return;
    }

    setUrlError(false);

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

      await editSponsor(token, Number(sponsorId), funderName, funderUrl);
      handleClose();
      onSponsorEdited();
    } catch (error) {
      console.error("Failed to edit funder:", error);
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
        <h2 className={styles.title}>Sponsor aanpassen</h2>
        <hr></hr>
        <div className={styles.formGroup}>
          <h3>Info</h3>
          <label className={styles.label}>Naam:</label>
          <input
            type="text"
            value={funderName}
            onChange={(e) => setFunderName(e.target.value)}
            className={styles.inputField}
          />
          {funderName.length > maxNameLength && (
            <span style={{ color: "red", display: "block", marginTop: "5px" }}>
              Sponsor naam mag niet meer dan {maxNameLength} karakters bevatten.
            </span>
          )}

          {nameError && funderName.length <= maxNameLength && (
            <span style={{ color: "red", display: "block", marginTop: "5px" }}>
              Vul een naam in.
            </span>
          )}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>URL:</label>
          <input
            type="text"
            value={funderUrl}
            onChange={(e) => setFunderUrl(e.target.value)}
            className={styles.inputField}
          />
          {!isUrlValid && (
            <span style={{ color: "red", display: "block", marginTop: "5px" }}>
              Vul een geldige URL in.
            </span>
          )}
          {urlError && (
            <span style={{ color: "red", display: "block", marginTop: "5px" }}>
              Vul een URL in.
            </span>
          )}
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

export default EditSponsor;
