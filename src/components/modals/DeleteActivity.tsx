import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import { deleteActivity } from "../middleware/Api";
import CloseIson from "/close-icon.svg";

interface DeleteActivityProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onActivityDeleted: () => void;
  initiativeId: string;
  activityId: string;
  authToken: string;
}

const DeleteActivity: React.FC<DeleteActivityProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  onActivityDeleted,
  initiativeId,
  activityId,
  authToken,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

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
      await deleteActivity(authToken, initiativeId, activityId);
      setApiError("");
      handleClose(true);
      onActivityDeleted();
    } catch (error) {
      console.error("Failed to delete activity:", error);
      if (error.response && error.response.status === 422) {
        setApiError("Validation Error");
      } else {
        setApiError("Failed to delete activity");
      }
    }
  };

  const handleClose = (wasDeleted: boolean = false) => {
    if (!isBlockingInteraction) {
      setModalIsOpen(false);
      onClose();
      if (wasDeleted) {
        navigate(`/funds/${initiativeId}`);
      } else {
        navigate(`/funds/${initiativeId}/activities/${activityId}`);
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
          <h2 className={styles.title}>Activiteit verwijderen</h2>
          <button
            onClick={() => handleClose(false)}
            className={styles.closeBtn}
          >
            <img src={CloseIson} alt="Close" />
          </button>
        </div>
        <hr></hr>
        <div className={styles.confirmation}>
          <p>Weet je zeker dat je de activiteit wil verwijderen?</p>
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

export default DeleteActivity;
