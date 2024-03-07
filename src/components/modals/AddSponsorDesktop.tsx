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
  const [nameError, setNameError] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [maxNameLength] = useState(128);

  useEffect(() => {
    if (isOpen) {
      setModalIsOpen(true);
    } else {
      setTimeout(() => {
        setModalIsOpen(false);
        setSponsorName("");
        setSponsorUrl("");
        setIsUrlValid(true);
        setNameError(null);
        setUrlError(null);
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
      setNameError("Vul een naam in.");
      setUrlError("Vul een URL in.");
      return;
    }

    if (!isValidUrl(sponsorUrl)) {
      setIsUrlValid(false);
      return;
    } else {
      setIsUrlValid(true);
    }

    if (sponsorName.trim() === "") {
      setNameError("Vul een naam in.");
      return;
    } else {
      setNameError(null);
    }

    if (sponsorName.length > maxNameLength) {
      setNameError("Naam mag niet meer dan 128 karakters bevatten.");
      return;
    }

    setUrlError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token is not available in localStorage");
      }
      await addSponsor(token, sponsorName, sponsorUrl);
      setSponsorName("");
      setSponsorUrl("");
      handleClose();
      onSponsorAdded();
    } catch (error) {
      if (error.response && error.response.status === 500) {
        setNameError(
          "Het maken van de sponsor is mislukt. Controlleer of de naam al in gebruik is.",
        );
      } else {
        setNameError(
          "Het maken van de sponsor is mislukt. Controlleer of de naam al in gebruik is.",
        );
      }
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
            onKeyPress={handleEnterKeyPress}
          />
          {nameError && (
            <span style={{ color: "red", display: "block", marginTop: "5px" }}>
              {nameError}
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
            onKeyPress={handleEnterKeyPress}
          />
          {!isUrlValid && (
            <span style={{ color: "red", display: "block", marginTop: "5px" }}>
              Vul een geldige URL in.
            </span>
          )}
          {urlError && (
            <span style={{ color: "red", display: "block", marginTop: "5px" }}>
              {urlError}
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
