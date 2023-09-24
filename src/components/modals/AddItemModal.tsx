import React from "react";
import styles from "./AddItemModal.module.scss";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

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
