import React, { useEffect, useState } from "react";
import deleteIcon from "/delete-icon.svg";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import SearchFundUsers from "../elements/search/funds/SearchFundsUser";
import ActivityImageUploader from "../elements/uploadder/ActivityImageUploader";
import { editActivity, uploadActivityPicture } from "../middleware/Api";

interface ActivityOwner {
  id: number;
  email: string;
}

interface ActivityDetails {
  id?: number;
  name?: string;
  description?: string;
  budget?: number;
  purpose?: string;
  target_audience?: string;
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
  fieldPermissions;
  fields: string[];
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
  fieldPermissions,
}) => {
  console.log("fieldPermissions:", fieldPermissions);
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const [isHidden, setIsHidden] = useState(false);
  const [apiError, setApiError] = useState("");
  const [formData, setFormData] = useState<ActivityDetails>({
    name: "",
    description: "",
    budget: 0,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [charCount, setCharCount] = useState(0);
  const [purposeCount, setPurposeCount] = useState(0);
  const [nameError, setNameError] = useState("");
  const [isSaveClicked, setIsSaveClicked] = useState(false);
  const [descriptionError, setDescriptionError] = useState("");
  const [purposeError, setPurposeError] = useState("");
  const [targetAudienceError, setTargetAudienceError] = useState("");

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

      setCharCount(
        activityData.description ? activityData.description.length : 0,
      );
    } else {
      setFormData({
        name: "",
        description: "",
        budget: 0,
      });
    }
  }, [isOpen, activityData]);

  const handleSave = async () => {
    setIsSaveClicked(true);
    if (charCount > 64) {
      setNameError("Naam mag maximaal 64 tekens bevatten");
      return;
    }

    if (!formData?.name || formData?.name.trim() === "") {
      setNameError("Naam mag niet leeg zijn");
      return;
    }

    try {
      const updatedActivityData = {
        name: formData.name || "",
        description: formData.description || "",
        purpose: formData.purpose || "",
        target_audience: formData.target_audience || "",
        hidden: isHidden,
        budget: formData.budget || 0,
      };

      let imageUploadResult;

      if (selectedImage) {
        imageUploadResult = await uploadActivityPicture(
          initiativeId,
          activityId,
          selectedImage,
          authToken,
        );
      }

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
      console.error("Failed to edit activity:", error);
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

  const handleImageChange = (file: File) => {
    setSelectedImage(file);
  };

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
          <h4>Algemene activiteitinstellingen</h4>
          {fieldPermissions.fields.includes("name") && (
            <>
              <label className={styles.label}>Naam:</label>
              <input
                type="text"
                placeholder="Naam"
                value={formData?.name || ""}
                onKeyPress={handleEnterKeyPress}
                onChange={(e) => {
                  const newName = e.target.value;

                  if (isSaveClicked) {
                    if (!newName.trim()) {
                      setNameError("Naam mag niet leeg zijn");
                    } else {
                      setNameError("");
                    }
                  }

                  if (newName.length <= 64) {
                    setFormData({ ...formData, name: newName });
                  }
                  setCharCount(newName.length);
                }}
              />
              {isSaveClicked && nameError && (
                <p style={{ color: "red", display: "block", marginTop: "5px" }}>
                  {nameError}
                </p>
              )}
              {charCount > 64 && (
                <p className={styles.error}>
                  Naam mag maximaal 64 tekens bevatten
                </p>
              )}
            </>
          )}
        </div>
        <div className={styles.formGroup}>
          {fieldPermissions.fields.includes("description") && (
            <>
              <label className={styles.label}>Beschrijving:</label>
              <textarea
                placeholder="Beschrijving"
                value={formData?.description || ""}
                onChange={(e) => {
                  const newDescription = e.target.value;

                  if (newDescription.length > 512) {
                    setDescriptionError(
                      "Beschrijving mag niet meer dan 512 karakters bevatten",
                    );
                  } else {
                    setDescriptionError("");
                  }

                  setFormData({ ...formData, description: newDescription });
                  setCharCount(newDescription.length);
                }}
                style={{ borderColor: descriptionError ? "red" : "" }}
              />
              {descriptionError && (
                <p style={{ color: "red", display: "block", marginTop: "5px" }}>
                  {descriptionError}
                </p>
              )}
              <div className={styles["chart-count"]}>{charCount} / 512</div>
            </>
          )}
        </div>
        <div className={styles.formGroup}>
          {fieldPermissions.fields.includes("purpose") && (
            <>
              <label className={styles.label}>Doel:</label>
              <textarea
                placeholder="Doelstelling"
                value={formData?.purpose || ""}
                onChange={(e) => {
                  const newPurpose = e.target.value;

                  if (newPurpose.length > 512) {
                    setPurposeError(
                      "Doelstelling mag niet meer dan 512 karakters bevatten",
                    );
                  } else {
                    setPurposeError("");
                  }

                  setFormData({ ...formData, purpose: newPurpose });
                  setPurposeCount(newPurpose.length);
                }}
                style={{ borderColor: purposeError ? "red" : "" }}
              />
              {purposeError && (
                <p style={{ color: "red", display: "block", marginTop: "5px" }}>
                  {purposeError}
                </p>
              )}
              <div className={styles["chart-count"]}>{purposeCount} / 512</div>
            </>
          )}
        </div>
        <div className={styles.formGroup}>
          {fieldPermissions.fields.includes("target_audience") && (
            <>
              <label className={styles.label}>Doelgroep:</label>
              <input
                type="text"
                placeholder="Doelgroep"
                value={formData?.target_audience || ""}
                onKeyPress={handleEnterKeyPress}
                onChange={(e) => {
                  const newTargetAudience = e.target.value;

                  if (isSaveClicked) {
                    if (!newTargetAudience.trim()) {
                      setTargetAudienceError("Doelgroep mag niet leeg zijn");
                    } else {
                      setTargetAudienceError("");
                    }
                  }

                  if (newTargetAudience.length <= 64) {
                    setFormData({
                      ...formData,
                      target_audience: newTargetAudience,
                    });
                  }
                  setCharCount(newTargetAudience.length);
                }}
              />
              {isSaveClicked && targetAudienceError && (
                <p style={{ color: "red", display: "block", marginTop: "5px" }}>
                  {targetAudienceError}
                </p>
              )}
            </>
          )}
        </div>
        <div className={styles.formGroup}>
          {fieldPermissions.fields.includes("hidden") && (
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
          )}
        </div>
        <div className={styles.formGroup}>
          {fieldPermissions.fields.includes("budget") && (
            <div className={styles.budgetContainer}>
              <label className={styles.labelField}> Begroting: </label>
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
          )}
        </div>

        <ActivityImageUploader
          initiativeId={initiativeId}
          token={authToken}
          onImageSelected={handleImageChange}
          activityId={activityId}
        />
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
