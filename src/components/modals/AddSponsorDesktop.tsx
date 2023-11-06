import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import { addSponsor } from "../middleware/Api";

interface AddSponsorDesktopProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onSponsorAdded: () => void;
}

const AddSponsorDesktop: React.FC<AddSponsorDesktopProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  onSponsorAdded,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const [sponsorName, setSponsorName] = useState("");
  const [sponsorUrl, setSponsorUrl] = useState("");
  const [isUrlValid, setIsUrlValid] = useState(true);
  const [nameError, setNameError] = useState(false);
  const [urlError, setUrlError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setModalIsOpen(true);
    } else {
      setTimeout(() => {
        setModalIsOpen(false);
      }, 300);
    }
  }, [isOpen]);

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSave = async () => {
    if (sponsorName.trim() === "" && sponsorUrl.trim() === "") {
      setNameError(true);
      setUrlError(true);
      return;
    }

    if (!isValidUrl(sponsorUrl)) {
      setIsUrlValid(false);
      return;
    } else {
      setIsUrlValid(true);
    }

    if (sponsorName.trim() === "") {
      setNameError(true);
      return;
    } else {
      setNameError(false);
    }

    setUrlError(false);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is not available in localStorage");
        return;
      }
      await addSponsor(token, sponsorName, sponsorUrl);
      setSponsorName("");
      setSponsorUrl("");
      handleClose();

      onSponsorAdded();
    } catch (error) {
      console.error("Failed to create sponsor:", error);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUrlValid(true);
    setSponsorUrl(e.target.value);
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
        <h2 className={styles.title}>Sponsor Aanmaken</h2>
        <hr></hr>
        <div className={styles.formGroup}>
          <h3>Info</h3>
          <label className={styles.labelEmail}>Naam:</label>
          <input
            type="text"
            placeholder="Voer een naam in"
            value={sponsorName}
            onChange={(e) => setSponsorName(e.target.value)}
          />
          {nameError && (
            <span style={{ color: "red", display: "block", marginTop: "5px" }}>
              Vul een naam in.
            </span>
          )}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>URL:</label>
          <input
            type="text"
            placeholder="Voer de URL in"
            value={sponsorUrl}
            onChange={handleUrlChange}
          />
          {!isUrlValid && (
            <span style={{ color: "red", display: "block", marginTop: "5px" }}>
              Vul een geldige URL in.
            </span>
          )}
          {urlError && (
            <span style={{ color: "red", display: "block", marginTop: "5px" }}>
              Vul een naam en URL in.
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

export default AddSponsorDesktop;
