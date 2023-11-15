import React, { useState, useEffect } from "react";
import FormButtons from "./buttons/FormButton";
import FormLayout from "./FormLayout";
import { useAuth } from "../../contexts/AuthContext";
import { EditUserProfileFormProps } from "../../types/EditUserProfileFormType";
import styles from "../../assets/scss/EditUserProfileForm.module.scss";
import ImageUploader from "../elements/uploadder/ImageUploader";
import {
  fetchUserProfileData,
  updateUserProfile,
  uploadProfileImage,
} from "../middleware/Api";

const EditUserProfileForm: React.FC<EditUserProfileFormProps> = ({
  userId,
  onCancel,
  fieldPermissions,
}) => {
  console.log("fieldPermissions:", fieldPermissions);
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

  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [bioCharCount, setBioCharCount] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    if (userId) {
      fetchUserProfileDataFromApi(userId, user?.token || "");
    }
  }, [userId]);

  console.log("fieldPermissions222:", fieldPermissions);

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

    setFormData({ ...formData, [name]: value });
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

      const response = await updateUserProfile(userId, formData, token);

      console.log("User profile updated:", response);

      setIsConfirmed(true);
      setIsSuccess(true);
      setIsError(false);
    } catch (error) {
      console.error("Failed to update user profile:", error);

      setIsError(true);
      setIsSuccess(false);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    setBioCharCount(value.length);

    setFormData({ ...formData, biography: value });
  };

  return (
    <>
      <FormLayout
        title="Profiel bewerken"
        showIcon={false}
        showOverviewButton={isConfirmed}
        reloadWindow={handleCancel}
      >
        {isConfirmed ? (
          <div className={styles["confirmation-container"]}>
            <h3>Profielgegevens bijgewerkt</h3>
            <p>
              De wijzigingen in het profiel van de gebruiker zijn succesvol
              bijgewerkt.
            </p>
          </div>
        ) : (
          <form>
            <h3>Info</h3>
            {fieldPermissions.fields.includes("first_name") && (
              <div className={styles["form-group"]}>
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
              </div>
            )}
            {fieldPermissions.fields.includes("last_name") && (
              <div className={styles["form-group"]}>
                <label
                  className={styles["label-last_name"]}
                  htmlFor="last_name"
                >
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
              <div className={styles["form-group"]}>
                <label
                  className={styles["label-biography"]}
                  htmlFor="biography"
                >
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
              <div className={styles["form-group"]}>
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
                <h3>Instellingen</h3>
                <div className={styles["form-group"]}>
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
              </>
            )}
          </form>
        )}
        {!isConfirmed && (
          <FormButtons
            continueLabel="Opslaan"
            cancelLabel="Annuleren"
            onContinue={handleSubmit}
            onCancel={handleCancel}
          />
        )}
      </FormLayout>
    </>
  );
};

export default EditUserProfileForm;
