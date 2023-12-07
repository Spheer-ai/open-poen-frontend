import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import { editActivity } from "../middleware/Api";

interface EditActivityProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onActivityEdited: () => void;
  initiativeId: string;
  activityId: string;
  authToken: string;
}

const EditActivity: React.FC<EditActivityProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  onActivityEdited,
  initiativeId,
  activityId,
  authToken,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const [apiError, setApiError] = useState("");
  const [activityData, setActivityData] = useState({
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
      await editActivity(authToken, initiativeId, activityId, activityData);
      setApiError("");
      handleClose();
      onActivityEdited();
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
        <h2 className={styles.title}>Edit Activity</h2>
        <hr></hr>
        <div className={styles.formGroup}>
          <h3>Activity Details</h3>
          <input
            type="text"
            placeholder="Name"
            value={activityData.name}
            onKeyPress={handleEnterKeyPress}
            onChange={(e) =>
              setActivityData({ ...activityData, name: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Description"
            value={activityData.description}
            onKeyPress={handleEnterKeyPress}
            onChange={(e) =>
              setActivityData({ ...activityData, description: e.target.value })
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

export default EditActivity;
