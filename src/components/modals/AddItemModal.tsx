import React from "react";
import styles from "../../assets/scss/AddItemModal.module.scss";
import { AddItemModalProps } from "../../types/AddItemModalTypes";

const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles["modal"]}>
      <div className={styles["modal-content"]}>
        <button className={styles["close-button"]} onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default AddItemModal;
