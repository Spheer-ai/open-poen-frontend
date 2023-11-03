import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";

interface AddBankConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
}

const AddBankConnectionModal: React.FC<AddBankConnectionModalProps> = ({
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
      });
    }
  }, [isOpen, onClose]);

  const handleClose = () => {
    if (!isBlockingInteraction) {
      setModalIsOpen(false);
      onClose();
    }
  };

  return (
    <>
      <div
        className={`${styles.backdrop} ${modalIsOpen ? styles.open : ""}`}
        onClick={onClose}
      ></div>
      <div className={`${styles.modal} ${modalIsOpen ? styles.open : ""}`}>
        <h2 className={styles.title}>Add Bank Connection</h2>
        <div className={styles.formGroup}></div>
        <div className={styles.buttonContainer}>
          <button onClick={handleClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button className={styles.saveButton}>Connect</button>
        </div>
      </div>
    </>
  );
};

export default AddBankConnectionModal;
