import React, { useState, useEffect } from "react";
import axios from "axios";
import FormButtons from "./buttons/FormButton";
import FormLayout from "./FormLayout";
import { useAuth } from "../../contexts/AuthContext";
import { EditUserProfileFormProps } from "../../types/EditUserProfileFormType";
import styles from "../../assets/scss/EditUserProfileForm.module.scss";
import ImageUploader from "../elements/uploadder/ImageUploader";

const EditUserProfileForm: React.FC<EditUserProfileFormProps> = ({
  userId,
  onCancel,
  onContinue,
}) => {
  const { user } = useAuth();

  const handleImageUpload = (image: File) => {
    console.log("Image uploaded:", image);
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

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const token = user?.token || "";
      const response = await axios.get(`/api/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const userData = response.data;

      setFormData({
        first_name: userData.first_name,
        last_name: userData.last_name,
        biography: userData.biography,
        hidden: userData.hidden,
      });
    } catch (error) {
      console.error("Failed to fetch user data:", error);
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

      const response = await axios.patch(`/api/user/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("User profile updated:", response.data);

      setIsConfirmed(true);
      setIsSuccess(true);
      setIsError(false);
    } catch (error) {
      console.error("Failed to update user profile:", error);

      setIsError(true);
      setIsSuccess(false);
    }
  };

  const reloadWindow = () => {
    window.location.reload();
  };

  const handleCancel = () => {
    onCancel();

    window.location.reload();
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
            <div className={styles["form-group"]}>
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
            <div className={styles["form-group"]}>
              <label className={styles["label-biography"]} htmlFor="biography">
                Biografie
              </label>
              <textarea
                id="biography"
                name="biography"
                placeholder="Voer een biografie in"
                value={formData.biography}
                onChange={handleChange}
                className={isSuccess ? "success" : isError ? "error" : ""}
              />
            </div>
            <div className={styles["form-group"]}>
              <label>Profielfoto</label>
              <ImageUploader onImageUpload={handleImageUpload} />
            </div>
            <hr />
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
