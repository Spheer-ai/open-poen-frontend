import React, { useEffect, useState, useRef } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import { Activities } from "../../types/ActivitiesTypes";
import { AddActivity as addActivityApi } from "../middleware/Api";
import useCachedImages from "../utils/images";

interface AddActivityProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onActivityAdded: (newActivity: Activities) => void;
  initiativeId: number;
}

const AddActivity: React.FC<AddActivityProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  onActivityAdded,
  initiativeId,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const [activityName, setActivityName] = useState("");
  const [activityDescription, setActivityDescription] = useState("");
  const [activityBudget, setActivityBudget] = useState<number | string>("");
  const [purpose, setPurpose] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const images = useCachedImages();
  const [hidden, setHidden] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    purpose: "",
    target_audience: "",
    budget: "",
  });

  const activityNameRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setModalIsOpen(true);
    } else {
      setTimeout(() => {
        setActivityName("");
        setActivityDescription("");
        setPurpose("");
        setTargetAudience("");
        setActivityBudget(0);
        setModalIsOpen(false);
      }, 300);
    }
  }, [isOpen]);

  const validateFields = () => {
    let isValid = true;

    const validationErrors = {
      name: "",
      description: "",
      purpose: "",
      target_audience: "",
      budget: "",
    };

    if (!activityName) {
      validationErrors.name = "Vul een naam in";
      isValid = false;
    }

    if (!activityDescription) {
      validationErrors.description = "Vul een beschrijving in";
      isValid = false;
    }

    if (!purpose) {
      validationErrors.purpose = "Vul een doel in";
      isValid = false;
    }

    if (!targetAudience) {
      validationErrors.target_audience = "Vul een doelgroep in";
      isValid = false;
    }

    if (
      !activityBudget ||
      isNaN(Number(activityBudget)) ||
      Number(activityBudget) < 0
    ) {
      validationErrors.budget = "Vul een geldig begrotingsbedrag in";
      isValid = false;
    } else if (Number(activityBudget) > 999999) {
      validationErrors.budget =
        "Het bedrag is te hoog, vul een lager bedrag in.";
      isValid = false;
    }

    setErrors(validationErrors);

    return isValid;
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is not available in localStorage");
        return;
      }

      if (!validateFields()) {
        return;
      }

      const activityData = {
        name: activityName,
        description: activityDescription,
        budget: Number(activityBudget),
        purpose: purpose,
        target_audience: targetAudience,
        hidden: hidden,
      };

      const newActivity = await addActivityApi(
        initiativeId,
        token,
        activityData,
      );
      onActivityAdded(newActivity);
      handleClose();
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setErrors({
            ...errors,
            name: "Initiative not found",
          });
        } else if (error.response.status === 409) {
          setErrors({
            ...errors,
            name: "Name already in use",
          });
        } else if (error.response.status === 422) {
          setErrors({
            ...errors,
            name: "Name must be max 65 characters",
            purpose: "Purpose must be max 65 characters",
            target_audience: "Target audience must be max 65 characters",
            description: "Description must be max 200 characters",
          });
        } else {
          console.error("Failed to add activity:", error);
        }
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
        <div className={styles.formTop}>
          <h2 className={styles.title}>Activiteit aanmaken</h2>
          <button onClick={handleClose} className={styles.closeBtn}>
            <img src={images.close} alt="Close Icon" />
          </button>
        </div>
        <hr></hr>
        <div className={styles.formGroup}>
          <h3>Info</h3>
          <label className={styles.labelField}>Naam activiteit:</label>
          <input
            type="text"
            placeholder="Vul de naam van het activiteit in"
            value={activityName}
            onChange={(e) => setActivityName(e.target.value)}
            ref={activityNameRef}
            onKeyDown={handleEnterKeyPress}
          />
          {errors.name && (
            <span style={{ color: "red", display: "block", marginTop: "5px" }}>
              {errors.name}
            </span>
          )}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelField}>Beschrijving:</label>
          <textarea
            className={styles.description}
            placeholder="Vul de omschrijving van het activiteit  in"
            value={activityDescription}
            onChange={(e) => setActivityDescription(e.target.value)}
          ></textarea>
          {errors.description && (
            <span style={{ color: "red", display: "block", marginTop: "5px" }}>
              {errors.description}
            </span>
          )}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelField}>Doel:</label>
          <input
            type="text"
            placeholder="Vul de doelstelling van de activiteit in"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            onKeyDown={handleEnterKeyPress}
          />
          {errors.purpose && (
            <span style={{ color: "red", display: "block", marginTop: "5px" }}>
              {errors.purpose}
            </span>
          )}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelField}>Doelgroep:</label>
          <input
            type="text"
            placeholder="Vul de doelgroep van de activiteit in"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            onKeyDown={handleEnterKeyPress}
          />
          {errors.target_audience && (
            <span style={{ color: "red", display: "block", marginTop: "5px" }}>
              {errors.target_audience}
            </span>
          )}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelField}>Begroting:</label>
          <input
            type="number"
            placeholder="Vul het begrootte bedrag in"
            value={activityBudget}
            onChange={(e) => setActivityBudget(e.target.value)}
            onKeyDown={handleEnterKeyPress}
          />
          {errors.budget && (
            <span style={{ color: "red", display: "block", marginTop: "5px" }}>
              {errors.budget}
            </span>
          )}
        </div>
        <div className={styles.formGroup}>
          <div className={styles.roleOptions}>
            <label className={styles.labelField}>
              <input
                type="checkbox"
                checked={hidden}
                onChange={(e) => setHidden(e.target.checked)}
              />
              Activiteit verbergen
            </label>
          </div>
        </div>
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

export default AddActivity;
