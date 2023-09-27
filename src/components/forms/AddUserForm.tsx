import React, { useState } from "react";
import axios from "axios";
import styles from "../../assets/scss/AddUserForm.module.scss";
import { useAuth } from "../../contexts/AuthContext";
import { AddUserFormProps } from "../../types/AddUserFormType";
import FormButtons from "./buttons/FormButton";
import FormLayout from "./FormLayout";

const AddUserForm: React.FC<AddUserFormProps> = ({ onContinue, onCancel }) => {
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    biography: "",
    role: "",
    is_active: true,
    is_superuser: false,
    is_verified: true,
    hidden: false,
  });

  const [showPersonalInfo, setShowPersonalInfo] = useState(false);

  const { user } = useAuth();

  const roleLabels = {
    administrator: "Beheerder",
    financial: "Financieel",
    user: "Gebruiker",
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;

    // If a checkbox is checked, update the role field accordingly
    if (checked) {
      setFormData({ ...formData, role: name });
    } else {
      // If a checkbox is unchecked, clear the role field
      setFormData({ ...formData, role: "" });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const token = user?.token || "";

      const response = await axios.post(
        "http://127.0.0.1:8000/user",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("User created:", response.data);

      onContinue();
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  return (
    <div>
      <FormLayout title="Gebruiker aanmaken" showIcon={true}> 
        <form>
          <div className={styles["form-group"]}>
            <h3>Info</h3>
            <label className={styles["label-email"]}htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Voer het e-mailadres in"
              value={formData.email}
              onChange={handleChange}
            />
            <p className={styles["description"]}>
              Als er nog geen gebruiker bestaat met dit e-mailadres, ontvangt
              deze een uitnodigingsmail met daarin een link om een wachtwoord
              aan te maken. Indien er al een gebruiker bestaat met dit
              e-mailadres, krijgt deze gebruiker de toegewezen rechten (hierover
              wordt geen e-mail verzonden).
            </p>
            <hr />
          </div>
          <div className={styles["form-group"]}>
            <h3>Rol</h3>
            <div className={styles["role-options"]}>
              {Object.entries(roleLabels).map(([apiRole, displayRole]) => (
                <label key={apiRole} className={styles["role-label"]}>
                  <input
                    type="checkbox"
                    name={apiRole}
                    checked={formData.role === apiRole}
                    onChange={handleCheckboxChange}
                  />
                  {displayRole}
                </label>
              ))}
            </div>
          </div>
          {showPersonalInfo && (
            <>
              <h3>Persoonlijke gegevens</h3>
              <div className={styles["form-group"]}>
                <label htmlFor="first_name">First Name:</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </div>
              <div className={styles["form-group"]}>
                <label htmlFor="last_name">Last Name:</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>
              <div className={styles["form-group"]}>
                <label htmlFor="biography">Biography:</label>
                <input
                  type="text"
                  id="biography"
                  name="biography"
                  value={formData.biography}
                  onChange={handleChange}
                />
              </div>
            </>
          )}
          <FormButtons
            continueLabel="Continue"
            cancelLabel="Cancel"
            onContinue={handleSubmit}
            onCancel={onCancel}
          />
        </form>
      </FormLayout>
    </div>
  );
};

export default AddUserForm;
