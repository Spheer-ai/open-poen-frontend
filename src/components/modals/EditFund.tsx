import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import { editFund } from "../middleware/Api";

interface EditFundProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onFundEdited: () => void;
  initiativeId: string;
  authToken: string;
}

const EditFund: React.FC<EditFundProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  onFundEdited,
  initiativeId,
  authToken,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const [apiError, setApiError] = useState("");
  const [fundData, setFundData] = useState({
    name: "",
    description: "",
    purpose: "",
    target_audience: "",
    owner: "",
  });

  useEffect(() => {
    if (isOpen) {
      setModalIsOpen(true);
    } else {
      setTimeout(() => {
        setModalIsOpen(false);
      }, 300);
    }
  }, [isOpen]);

  const handleSave = async () => {
    try {
      await editFund(authToken, initiativeId, fundData);
      setApiError("");
      handleClose();
      onFundEdited();
    } catch (error) {
      console.error("Failed to edit fund:", error);
      if (error.response && error.response.status === 409) {
        setApiError("Name is already in use");
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
        <h2 className={styles.title}>Edit Fund</h2>
        <hr></hr>
        <div className={styles.formGroup}>
          <h3>Fund Details</h3>
          <input
            type="text"
            placeholder="Name"
            value={fundData.name}
            onKeyPress={handleEnterKeyPress}
            onChange={(e) => setFundData({ ...fundData, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description"
            value={fundData.description}
            onKeyPress={handleEnterKeyPress}
            onChange={(e) =>
              setFundData({ ...fundData, description: e.target.value })
            }
          />
        </div>
        {apiError && <p className={styles.error}>{apiError}</p>}
        <div className={styles.buttonContainer}>
          <button onClick={handleClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button onClick={handleSave} className={styles.saveButton}>
            Update
          </button>
        </div>
      </div>
    </>
  );
};

export default EditFund;
