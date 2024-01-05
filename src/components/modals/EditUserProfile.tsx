import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { EditUserProfileFormProps } from "../../types/EditUserProfileFormType";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import ImageUploader from "../elements/uploadder/ImageUploader";
import {
  fetchUserProfileData,
  updateUserProfile,
  uploadProfileImage,
} from "../middleware/Api";

const EditUserProfileForm: React.FC<EditUserProfileFormProps> = ({
  userId,
  fieldPermissions,
  isOpen,
  onClose,
  isBlockingInteraction,
  onUserProfileEdited,
}) => {
  const { user } = useAuth();

  const handleImageUpload = (image: File) => {
    setSelectedImage(image);
  };

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    biography: "",
    hidden: false,
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [bioCharCount, setBioCharCount] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);

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
    if (userId) {
      fetchUserProfileDataFromApi(userId, user?.token || "");
    }
  }, [userId]);

  const fetchUserProfileDataFromApi = async (userId: string, token: string) => {
    try {
      const profileData = await fetchUserProfileData(token, userId);

      setFormData({
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        biography: profileData.biography,
        hidden: profileData.hidden,
      });
    } catch (error) {
      console.error("Failed to fetch user profile data:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "hidden" && !fieldPermissions.fields.includes("hidden")) {
      return;
    }

    if (e.target.type === "checkbox") {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async () => {
    try {
      const token = user?.token || "";

      if (!userId) {
        console.error("userId is null");
        return;
      }

      if (selectedImage) {
        await uploadProfileImage(userId, selectedImage, token);
      }

      const formDataToSend = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        biography: formData.biography,
        ...(fieldPermissions.fields.includes("hidden") && {
          hidden: formData.hidden,
        }),
      };

      const response = await updateUserProfile(userId, formDataToSend, token);

      setIsSuccess(true);
      setIsError(false);
      onUserProfileEdited();
      handleClose();
    } catch (error) {
      console.error("Failed to update user profile:", error);

      setIsError(true);
      setIsSuccess(false);
    }
  };

  const handleClose = () => {
    if (!isBlockingInteraction) {
      setModalIsOpen(false);
      onClose();
    }
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    setBioCharCount(value.length);

    setFormData({ ...formData, biography: value });
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
        <h2 className={styles.title}>Gebruiker bewerken</h2>
        <hr></hr>
        <form>
          <div className={styles.formGroup}>
            <h3>Info</h3>
            {fieldPermissions.fields.includes("first_name") && (
              <>
                <label
                  className={styles["label-first_name"]}
                  htmlFor="first_name"
                >
                  Voornaam
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  placeholder="Voer de voornaam in"
                  value={formData.first_name}
                  onChange={handleChange}
                  className={isSuccess ? "success" : isError ? "error" : ""}
                />
              </>
            )}
          </div>
          {fieldPermissions.fields.includes("last_name") && (
            <div className={styles.formGroup}>
              <label className={styles["label-last_name"]} htmlFor="last_name">
                Achternaam
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                placeholder="Voer de achternaam in"
                value={formData.last_name}
                onChange={handleChange}
                className={isSuccess ? "success" : isError ? "error" : ""}
              />
            </div>
          )}
          {fieldPermissions.fields.includes("biography") && (
            <div className={styles.formGroup}>
              <label className={styles["label-biography"]} htmlFor="biography">
                Biografie
              </label>
              <textarea
                id="biography"
                name="biography"
                placeholder="Voer een biografie in"
                value={formData.biography}
                onChange={handleBioChange}
                className={isSuccess ? "success" : isError ? "error" : ""}
              />

              <div className={styles["chart-count-container"]}>
                <div
                  className={
                    bioCharCount > 500
                      ? styles["char-count-error"]
                      : styles["char-count"]
                  }
                >
                  {bioCharCount}/500
                </div>
                {bioCharCount > 500 && (
                  <div className={styles["error-message"]}>
                    Biografie mag maximaal 500 tekens bevatten.
                  </div>
                )}
              </div>
            </div>
          )}
          {userId && (
            <div className={styles.formGroup}>
              <label>Profielfoto</label>
              <ImageUploader
                onImageUpload={handleImageUpload}
                userId={userId}
                token={user?.token || ""}
              />
            </div>
          )}
          <hr />
          {fieldPermissions.fields.includes("hidden") && (
            <>
              <div className={styles.formGroup}>
                <h3>Instellingen</h3>
                <div className={styles.roleOptions}>
                  <label>
                    <input
                      type="checkbox"
                      name="hidden"
                      checked={formData.hidden}
                      onChange={handleChange}
                    />

                    <p>Gebruiker verbergen in overzicht</p>
                  </label>
                </div>
              </div>
            </>
          )}
        </form>
        <div className={styles.buttonContainer}>
          <button onClick={handleClose} className={styles.cancelButton}>
            Annuleren
          </button>
          <button onClick={handleSubmit} className={styles.saveButton}>
            Opslaan
          </button>
        </div>
      </div>
    </>
  );
};

export default EditUserProfileForm;
