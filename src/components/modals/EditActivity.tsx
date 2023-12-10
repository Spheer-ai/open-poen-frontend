import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import { editActivity } from "../middleware/Api";

interface ActivityDetails {
  id?: number;
  name?: string;
  description?: string;
  budget?: number;
}

interface EditActivityProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onActivityEdited: () => void;
  initiativeId: string;
  activityId: string;
  authToken: string;
  activityData: ActivityDetails | null;
}

const EditActivity: React.FC<EditActivityProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  onActivityEdited,
  initiativeId,
  activityId,
  authToken,
  activityData,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const [isHidden, setIsHidden] = useState(false);
  const [apiError, setApiError] = useState("");
  const [formData, setFormData] = useState<ActivityDetails>({
    name: "",
    description: "",
    budget: 0,
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

  useEffect(() => {
    if (isOpen && activityData) {
      setFormData(activityData);
    } else {
      setFormData({
        name: "",
        description: "",
        budget: 0,
      });
    }
  }, [isOpen, activityData]);

  const handleSave = async () => {
    try {
      const updatedActivityData = {
        name: formData.name || "",
        description: formData.description || "",
        hidden: isHidden,
        budget: formData.budget || 0,
      };

      console.log("Updated Activity Data:", updatedActivityData);

      await editActivity(
        authToken,
        initiativeId,
        activityId,
        updatedActivityData,
      );
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
        <h2 className={styles.title}>Beheer activiteit</h2>
        <hr></hr>
        <div className={styles.formGroup}>
          <h4>Algemene activiteitinstelingen</h4>
          <label className={styles.label}>Naam:</label>
          <input
            type="text"
            placeholder="Naam"
            value={formData.name}
            onKeyPress={handleEnterKeyPress}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <label className={styles.label}>Beschrijving:</label>
          <textarea
            placeholder="Beschrijving"
            value={formData?.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <div className={styles.roleOptions}>
            <label className={styles.roleLabel}>
              <input
                type="checkbox"
                checked={isHidden}
                onChange={() => setIsHidden(!isHidden)}
              />
              Activiteit verbergen
            </label>
          </div>
          <label className={styles.labelField}>Begroting:</label>
          <input
            type="number"
            placeholder="Vul het begrootte bedrag in"
            name="budget"
            onKeyDown={handleEnterKeyPress}
            value={formData?.budget || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                budget: parseFloat(e.target.value) || 0,
              })
            }
          />
        </div>
        {apiError && <p className={styles.error}>{apiError}</p>}
        <div className={styles.buttonContainer}>
          <button onClick={handleClose} className={styles.cancelButton}>
            Annuleren
          </button>
          <button onClick={handleSave} className={styles.saveButton}>
            Opslaan
          </button>
        </div>
      </div>
    </>
  );
};

export default EditActivity;
