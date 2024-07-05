import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import FundImageUploader from "../elements/uploadder/FundImageUploader";
import { editFund, uploadFundPicture } from "../middleware/Api";
import CloseIson from "/close-icon.svg";
import { useFieldPermissions } from "../../contexts/FieldPermissionContext";
import { EditFundProps, FundDetails } from "../../types/EditFundTypes";

const EditFund: React.FC<EditFundProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  onFundEdited,
  initiativeId,
  authToken,
  fundData,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const [isHiddenSponsors, setIsHiddenSponsors] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [apiError, setApiError] = useState("");
  const [formData, setFormData] = useState<FundDetails>({
    grant: fundData?.grant || {},
    id: fundData?.id,
    name: fundData?.name || "",
    description: fundData?.description || "",
    budget: fundData?.budget,
    income: fundData?.income,
    expenses: fundData?.expenses,
    purpose: fundData?.purpose,
    target_audience: fundData?.target_audience,
    kvk_registration: fundData?.kvk_registration,
    location: fundData?.location,
    profile_picture: fundData?.profile_picture,
    initiative_owners: fundData?.initiative_owners,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [charCount, setCharCount] = useState(0);
  const [purposeCount, setPurposeCount] = useState(0);
  const [nameError, setNameError] = useState("");
  const [isSaveClicked, setIsSaveClicked] = useState(false);
  const [descriptionError, setDescriptionError] = useState("");
  const [purposeError, setPurposeError] = useState("");
  const [targetAudienceError, setTargetAudienceError] = useState("");

  const { fieldPermissions, fetchFieldPermissions } = useFieldPermissions();

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
    if (isOpen) {
      console.log(
        `EditFund: Fetching field permissions for initiative ID ${initiativeId}`,
      );
      fetchFieldPermissions("Initiative", parseInt(initiativeId), authToken);
    }
  }, [isOpen, initiativeId, authToken, fetchFieldPermissions]);

  useEffect(() => {
    if (isOpen && fundData) {
      setFormData({
        ...formData,
        grant: fundData.grant || {},
        id: fundData.id,
        name: fundData.name || "",
        description: fundData.description || "",
        budget: fundData.budget,
        income: fundData.income,
        expenses: fundData.expenses,
        purpose: fundData.purpose,
        target_audience: fundData.target_audience,
        kvk_registration: fundData.kvk_registration,
        location: fundData.location,
        profile_picture: fundData.profile_picture,
        initiative_owners: fundData.initiative_owners,
      });
      setCharCount(fundData.description ? fundData.description.length : 0);
    }
  }, [isOpen, fundData]);

  useEffect(() => {
    console.log("EditFund: Current field permissions:", fieldPermissions);
  }, [fieldPermissions]);

  const handleSave = async () => {
    setIsSaveClicked(true);
    if (!formData?.name || formData?.name.trim().length > 64) {
      setNameError("Naam mag maximaal 64 tekens bevatten");
      return;
    }

    if (!formData?.name || formData?.name.trim() === "") {
      setNameError("Naam mag niet leeg zijn");
      return;
    }

    try {
      const updatedFundData = {
        ...formData,
        purpose: formData.purpose || "",
        target_audience: formData.target_audience || "",
        kvk_registration: formData.kvk_registration || "",
        location: formData.location || "",
        hidden_sponsors: isHiddenSponsors,
        hidden: isHidden,
      };

      let imageUploadResult;

      if (selectedImage) {
        imageUploadResult = await uploadFundPicture(
          initiativeId,
          selectedImage,
          authToken,
        );
      }

      await editFund(authToken, initiativeId, updatedFundData);

      setApiError("");
      handleClose();
      onFundEdited(updatedFundData);
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

  const handleImageChange = (file: File) => {
    setSelectedImage(file);
  };

  const fields = fieldPermissions.fields || [];

  return (
    <>
      <div
        className={`${styles.backdrop} ${modalIsOpen ? styles.open : ""}`}
        onClick={handleClose}
      ></div>
      <div className={`${styles.modal} ${modalIsOpen ? styles.open : ""}`}>
        <div className={styles.formTop}>
          <h2 className={styles.title}>Beheer initiatief</h2>
          <button onClick={handleClose} className={styles.closeBtn}>
            <img src={CloseIson} alt="" />
          </button>
        </div>
        <hr></hr>
        <div className={styles.formGroup}>
          <h4>Algemene initiatiefinstellingen</h4>
          {fields.includes("name") && (
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
                    } else if (newName.length > 64) {
                      setNameError("Naam mag maximaal 64 tekens bevatten");
                    } else {
                      setNameError("");
                    }
                  }

                  setFormData({ ...formData, name: newName });
                }}
              />
              {isSaveClicked && nameError && (
                <p style={{ color: "red", display: "block", marginTop: "5px" }}>
                  {nameError}
                </p>
              )}
            </>
          )}
        </div>
        <div className={styles.formGroup}>
          {fields.includes("description") && (
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
          {fields.includes("purpose") && (
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
          {fields.includes("target_audience") && (
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

                  setFormData({
                    ...formData,
                    target_audience: newTargetAudience,
                  });
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
          {fields.includes("kvk_registration") && (
            <>
              <label className={styles.label}>KVK Registratie:</label>
              <input
                type="text"
                placeholder="KVK Registratie"
                value={formData?.kvk_registration || ""}
                onChange={(e) => {
                  const newKvkRegistration = e.target.value;
                  setFormData({
                    ...formData,
                    kvk_registration: newKvkRegistration,
                  });
                }}
              />
              {/* TO DO: Error message display */}
            </>
          )}
        </div>
        <div className={styles.formGroup}>
          {fields.includes("location") && (
            <>
              <label className={styles.label}>Locatie:</label>
              <input
                type="text"
                placeholder="Locatie"
                value={formData?.location || ""}
                onChange={(e) => {
                  const newLocation = e.target.value;
                  setFormData({ ...formData, location: newLocation });
                }}
              />
              {/* TO DO: Error message display */}
            </>
          )}
        </div>
        <div className={styles.formGroup}>
          <div className={styles.roleOptions}>
            {fields.includes("hidden") && (
              <label className={styles.roleLabel}>
                <input
                  type="checkbox"
                  checked={isHidden}
                  onChange={() => setIsHidden(!isHidden)}
                />
                Initiatief verbergen
              </label>
            )}
            {fields.includes("hidden_sponsors") && (
              <label className={styles.roleLabel}>
                <input
                  type="checkbox"
                  checked={isHiddenSponsors}
                  onChange={() => setIsHiddenSponsors(!isHiddenSponsors)}
                />
                Sponsors verbergen
              </label>
            )}
          </div>
        </div>
        <div className={styles.formGroup}>
          {fields.includes("budget") && (
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

        <FundImageUploader
          initiativeId={initiativeId}
          token={authToken}
          onImageSelected={handleImageChange}
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

export default EditFund;
