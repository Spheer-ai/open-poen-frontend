import React, { useEffect, useState } from "react";
import deleteIcon from "/delete-icon.svg";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import SearchFundUsers from "../elements/search/funds/SearchFundsUser";
import FundImageUploader from "../elements/uploadder/FundImageUploader";
import {
  editFund,
  updateInitiativeOwners,
  uploadFundPicture,
} from "../middleware/Api";

interface InitiativeOwner {
  id: number;
  email: string;
}

interface FundDetails {
  id?: number;
  name?: string;
  description?: string;
  budget?: number;
  income?: number;
  expenses?: number;
}

interface EditFundProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onFundEdited: () => void;
  initiativeId: string;
  authToken: string;
  fundData: FundDetails | null;
  initiativeOwners: InitiativeOwner[];
  fieldPermissions;
  fields: string[];
}

const EditFund: React.FC<EditFundProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  onFundEdited,
  initiativeId,
  authToken,
  fundData,
  initiativeOwners,
  fieldPermissions,
}) => {
  console.log("fieldPermissions:", fieldPermissions);
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const [isHiddenSponsors, setIsHiddenSponsors] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [apiError, setApiError] = useState("");
  const [formData, setFormData] = useState<FundDetails | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [userEmailMapping, setUserEmailMapping] = useState<{
    [key: number]: string;
  }>({});
  const [selectedOwners, setSelectedOwners] = useState<InitiativeOwner[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<InitiativeOwner[]>([]);
  const [charCount, setCharCount] = useState(0);
  const [nameError, setNameError] = useState("");
  const [isSaveClicked, setIsSaveClicked] = useState(false);

  useEffect(() => {
    setSelectedOwners(initiativeOwners);
  }, [initiativeOwners]);

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
    if (isOpen && fundData) {
      setFormData(fundData);
    }
  }, [isOpen, fundData]);

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
      const updatedFundData = {
        ...formData,
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

      await linkOwnersToInitiative(initiativeId, selectedUserIds, authToken);

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

  const handleImageChange = (file: File) => {
    setSelectedImage(file);
  };

  const handleSearchResult = (user) => {
    if (!selectedUsers.some((selectedUser) => selectedUser.id === user.id)) {
      setSelectedUsers((prevSelectedUsers) => [...prevSelectedUsers, user]);
    }
  };

  const handleDeleteOwner = (ownerId: number) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.filter((user) => user.id !== ownerId),
    );
  };

  const linkOwnersToInitiative = async (
    initiativeId,
    selectedUserIds,
    authToken,
  ) => {
    try {
      await updateInitiativeOwners(initiativeId, selectedUserIds, authToken);
    } catch (error) {
      console.error("Error linking owners to initiative:", error);
    }
  };

  return (
    <>
      <div
        className={`${styles.backdrop} ${modalIsOpen ? styles.open : ""}`}
        onClick={handleClose}
      ></div>
      <div className={`${styles.modal} ${modalIsOpen ? styles.open : ""}`}>
        <h2 className={styles.title}>Beheer initiatief</h2>
        <hr></hr>
        <div className={styles.formGroup}>
          <h4>Algemene initiatiefinstellingen</h4>
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
          {fieldPermissions.fields.includes("description") && (
            <>
              <label className={styles.label}>Beschrijving:</label>
              <textarea
                placeholder="Beschrijving"
                value={formData?.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </>
          )}
          <div className={styles.roleOptions}>
            {fieldPermissions.fields.includes("hidden") && (
              <>
                <label className={styles.roleLabel}>
                  <input
                    type="checkbox"
                    checked={isHidden}
                    onChange={() => setIsHidden(!isHidden)}
                  />
                  Initiatief verbergen
                </label>
              </>
            )}
            {fieldPermissions.fields.includes("hidden_sponsors") && (
              <>
                <label className={styles.roleLabel}>
                  <input
                    type="checkbox"
                    checked={isHiddenSponsors}
                    onChange={() => setIsHiddenSponsors(!isHiddenSponsors)}
                  />
                  Sponsors verbergen
                </label>
              </>
            )}
          </div>
          {fieldPermissions.fields.includes("budget") && (
            <>
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
            </>
          )}
        </div>
        <div className={styles.formGroup}>
          <SearchFundUsers
            authToken={authToken}
            onUserClick={handleSearchResult}
          />
          <div className={styles.selectedUsers}>
            <h4>Initiatiefnemers</h4>
            <ul>
              {selectedUsers.map((user) => (
                <li key={user.id}>
                  {user.email}
                  <button onClick={() => handleDeleteOwner(user.id)}>
                    <img
                      src={deleteIcon}
                      alt="Delete"
                      className={styles.deleteIcon}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <FundImageUploader
            initiativeId={initiativeId}
            token={authToken}
            onImageSelected={handleImageChange}
          />
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

export default EditFund;
