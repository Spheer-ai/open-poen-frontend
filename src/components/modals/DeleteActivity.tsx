import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/DeleteActivity.module.scss";
import { deleteActivity } from "../middleware/Api"; // You will need to define the deleteActivity function in your API file

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
      handleClose();
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
        <h2 className={styles.title}>Delete Activity</h2>
        <hr></hr>
        <div className={styles.confirmation}>
          <p>Are you sure you want to delete this activity?</p>
        </div>
        {apiError && <p className={styles.error}>{apiError}</p>}
        <div className={styles.buttonContainer}>
          <button onClick={handleClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button onClick={handleDelete} className={styles.deleteButton}>
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

export default DeleteActivity;
