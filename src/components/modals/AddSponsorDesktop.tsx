// AddFundDesktop.js
import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";

interface AddSponsorDesktopProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
}

const AddSponsorDesktop: React.FC<AddSponsorDesktopProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setModalIsOpen(true);
    } else {
      setTimeout(() => {
        setModalIsOpen(false);
      }, 300);
    }
  }, [isOpen]);

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
        <h2 className={styles.title}>Add Sponsor</h2>
        {/* Form elements */}
        <div className={styles.formGroup}>
          <label className={styles.labelEmail}>Fund Name:</label>
          <input type="text" placeholder="Enter sponsor name" />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Description:</label>
          <textarea
            className={styles.description}
            placeholder="Enter sponsor description"
          ></textarea>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Amount:</label>
          <input type="number" placeholder="Enter amount" />
        </div>
        {/* Buttons */}
        <div className={styles.buttonContainer}>
          <button onClick={handleClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button className={styles.saveButton}>Save</button>
        </div>
      </div>
    </>
  );
};

export default AddSponsorDesktop;
