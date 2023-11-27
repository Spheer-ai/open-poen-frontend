import React, { useEffect, useState, useRef } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import { AddActivity as addActivityApi } from "../middleware/Api";

interface AddActivityProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onActivityAdded: () => void;
  refreshTrigger: number;
}

const AddActivity: React.FC<AddActivityProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  onActivityAdded,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const [activityName, setActivityName] = useState("");
  const [activityDescription, setActivityDescription] = useState("");
  const [activityBudget, setActivityBudget] = useState(0);
  const [purpose, setPurpose] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [hidden, setHidden] = useState(false);
  const activityNameRef = useRef<HTMLInputElement | null>(null);

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
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is not available in localStorage");
        return;
      }

      const activityData = {
        name: activityName,
        description: activityDescription,
        budget: activityBudget,
        purpose: purpose,
        target_audience: targetAudience,
        hidden: hidden,
      };

      const initiativeId = 1;
      await addActivityApi(initiativeId, token, activityData);
      onActivityAdded();
      handleClose();
    } catch (error) {
      console.error("Failed to add activity:", error);
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
        <h2 className={styles.title}>Add Activity</h2>
        <div className={styles.formGroup}>
          <label className={styles.labelField}>Activity Name:</label>
          <input
            type="text"
            placeholder="Enter activity name"
            value={activityName}
            onChange={(e) => setActivityName(e.target.value)}
            ref={activityNameRef}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelField}>Beschrijving:</label>
          <textarea
            className={styles.description}
            placeholder="Enter activity description"
            value={activityDescription}
            onChange={(e) => setActivityDescription(e.target.value)}
          ></textarea>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelField}>Begroting:</label>
          <input
            type="number"
            placeholder="Enter budget"
            value={activityBudget}
            onChange={(e) => setActivityBudget(Number(e.target.value))}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelField}>Doel:</label>
          <input
            type="text"
            placeholder="Enter purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelField}>Doelgroep:</label>
          <input
            type="text"
            placeholder="Enter target audience"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelField}>Activiteit verbergen</label>
          <input
            type="checkbox"
            checked={hidden}
            onChange={(e) => setHidden(e.target.checked)}
          />
        </div>
        <div className={styles.buttonContainer}>
          <button onClick={handleClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button onClick={handleSave} className={styles.saveButton}>
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default AddActivity;
