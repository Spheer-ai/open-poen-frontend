import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundModal.module.scss";
import { addSponsor } from "../middleware/Api";

interface AddSponsorMobileProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onSponsorAdded: () => void;
}

const AddSponsorMobile: React.FC<AddSponsorMobileProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  onSponsorAdded,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const [sponsorName, setSponsorName] = useState("");
  const [sponsorUrl, setSponsorUrl] = useState("");
  const [isUrlValid, setIsUrlValid] = useState(true);

  useEffect(() => {
    console.log("Component rendered with isOpen:", isOpen);
    if (isOpen) {
      setModalIsOpen(true);
    } else {
      console.log("Closing modal");
      setTimeout(() => {
        console.log("Modal closed with modalIsOpen:", modalIsOpen);
        setModalIsOpen(false);
      }, 150);
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
    if (!isValidUrl(sponsorUrl)) {
      setIsUrlValid(false);
      return;
    }

    setIsUrlValid(true);

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
    console.log("Modal is not open");
    return null;
  }

  return (
    <>
      <div
        className={`${styles.backdrop} ${modalIsOpen ? styles.open : ""}`}
        onClick={handleClose}
      ></div>
      <div className={`${styles.modal} ${modalIsOpen ? styles.open : ""}`}>
        <h2 className={styles.title}>Sponsor aanmaken</h2>
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
            <span style={{ color: "red" }}>Vul een geldigle URL in.</span>
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

export default AddSponsorMobile;
