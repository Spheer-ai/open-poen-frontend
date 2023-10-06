import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundModal.module.scss"; // Import your CSS module

interface AddFundModalProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean; // Add this prop
}

const AddFundModal: React.FC<AddFundModalProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);

  useEffect(() => {
    console.log("Component rendered with isOpen:", isOpen);
    if (isOpen) {
      setModalIsOpen(true);
    } else {
      console.log("Closing modal"); // Log when modal is closing
      setTimeout(() => {
        console.log("Modal closed with modalIsOpen:", modalIsOpen);
        setModalIsOpen(false);
      }, 150);
    }
  }, [isOpen]);

  const handleClose = () => {
    if (!isBlockingInteraction) {
      setModalIsOpen(false);
      onClose();
    }
  };

  if (!isOpen && !modalIsOpen) {
    console.log("Modal is not open"); // Log when modal is not open
    return null;
  }

  return (
    <>
      <div
        className={`${styles.backdrop} ${modalIsOpen ? styles.open : ""}`}
        onClick={handleClose}
      ></div>
      <div className={`${styles.modal} ${modalIsOpen ? styles.open : ""}`}>
        <h2 className={styles.title}>Add Fund</h2>
        {/* Form elements */}
        <div className={styles.formGroup}>
          <label className={styles.labelEmail}>Fund Name:</label>
          <input type="text" placeholder="Enter fund name" />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Description:</label>
          <textarea
            className={styles.description}
            placeholder="Enter fund description"
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

export default AddFundModal;
