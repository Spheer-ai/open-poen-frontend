import React, { useState, useEffect } from "react";
import axios from "axios";
import FormButtons from "./buttons/FormButton";
import FormLayout from "./FormLayout";
import { useAuth } from "../../contexts/AuthContext";
import { EditUserProfileFormProps } from "../../types/EditUserProfileFormType"; // Create/EditUserProfileFormProps as needed
import styles from "../../assets/scss/EditUserProfileForm.module.scss"; // Adjust the import path

const EditUserProfileForm: React.FC<EditUserProfileFormProps> = ({
  userId,
  onCancel,
  onContinue
}) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    biography: "",
    hidden: false,
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      onContinue();
      window.location.reload(); // Consider using a more specific update mechanism
    } catch (error) {
      console.error("Failed to update user profile:", error);
    }
  };

  return (
    <div>
      <FormLayout title={`Bewerk Profiel`} showIcon={false}>
        <form>
          <h3>Personal Information</h3>
          <div className={styles["form-group"]}>
            <label className={styles["label-first_name"]} htmlFor="first_name">
              Voornaam
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              placeholder="Voer de voornaam in"
              value={formData.first_name}
              onChange={handleChange}
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
            />
          </div>
          <hr />
          <h3>Settings</h3>
          <div className={styles["form-group"]}>
            <label>
              <input
                type="checkbox"
                name="hidden"
                checked={formData.hidden}
                onChange={handleChange}
              />
              Gebruiker verbergen in overzicht
            </label>
          </div>
        </form>
        <FormButtons
          continueLabel="Opslaan"
          cancelLabel="Annuleren"
          onContinue={handleSubmit}
          onCancel={onCancel}
        />
      </FormLayout>
    </div>
  );
};

export default EditUserProfileForm;
