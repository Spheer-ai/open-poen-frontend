import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import { useNavigate } from "react-router-dom";
import { deleteInitiative } from "../middleware/Api";
import useCachedImages from "../utils/images";

interface DeleteFundProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onFundDeleted: () => void;
  initiativeId: string;
  authToken: string;
}
const DeleteFund: React.FC<DeleteFundProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  onFundDeleted,
  initiativeId,
  authToken,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const images = useCachedImages(["close"]);

  useEffect(() => {
    if (isOpen) {
      setModalIsOpen(true);
    } else {
      setTimeout(() => {
        setModalIsOpen(false);
      }, 300);
    }
  }, [isOpen]);

  const handleDelete = async () => {
    try {
      const response = await deleteInitiative(authToken, initiativeId);
      setApiError("");
      handleClose(true);
      onFundDeleted();
      navigate(`/funds`);
    } catch (error) {
      console.error("Failed to delete fund:", error);
      if (error.response && error.response.status === 422) {
        setApiError("Validation Error");
      } else {
        setApiError("Failed to delete fund");
      }
    }
  };

  const handleClose = (wasDeleted: boolean = false) => {
    if (!isBlockingInteraction) {
      setModalIsOpen(false);
      onClose();
      if (!wasDeleted) {
        navigate(`/funds/${initiativeId}`);
      }
    }
  };

  if (!isOpen && !modalIsOpen) {
    return null;
  }

  return (
    <>
      <div
        className={`${styles.backdrop} ${modalIsOpen ? styles.open : ""}`}
        onClick={() => handleClose(false)}
      ></div>
      <div className={`${styles.modal} ${modalIsOpen ? styles.open : ""}`}>
        <div className={styles.formTop}>
          <h2 className={styles.title}>Initiatief verwijderen</h2>
          <button
            onClick={() => handleClose(false)}
            className={styles.closeBtn}
          >
            <img src={images.close} alt="Close Icon" />
          </button>
        </div>
        <hr></hr>
        <div className={styles.confirmation}>
          <p>Weet je zeker dat je het initatief wil verwijderen?</p>
        </div>
        {apiError && <p className={styles.error}>{apiError}</p>}
        <div className={styles.buttonContainer}>
          <button
            onClick={() => handleClose(false)}
            className={styles.cancelButton}
          >
            Annuleren
          </button>
          <button onClick={handleDelete} className={styles.deleteButton}>
            Verwijderen
          </button>
        </div>
      </div>
    </>
  );
};

export default DeleteFund;
