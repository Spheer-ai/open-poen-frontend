import React, { useState } from "react";
import styles from "../../assets/scss/AddUserForm.module.scss";
import { useAuth } from "../../contexts/AuthContext";
import FormButtons from "./buttons/FormButton";
import FormLayout from "./FormLayout";
import { createUser } from "../middleware/Api";

export type UserFormData = {
  email: string;
  first_name: string;
  last_name: string;
  biography: string;
  role: string;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
  hidden: boolean;
};

const initialFormData: UserFormData = {
  email: "",
  first_name: "",
  last_name: "",
  biography: "",
  role: "",
  is_active: true,
  is_superuser: false,
  is_verified: true,
  hidden: false,
};

const AddUserForm: React.FC<{
  onContinue: () => void;
  onCancel: () => void;
}> = ({ onCancel }) => {
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const { user } = useAuth();
  const [isConfirmed, setIsConfirmed] = useState(false); // State for confirmation

  const roleLabels = {
    administrator: "Beheerder",
    financial: "Financieel",
    user: "Gebruiker",
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

      // Convert UserFormData to FormData
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      const response = await createUser(formDataToSend, token);
      console.log("User created:", response);

      // Set the confirmation state to true
      setIsConfirmed(true);
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  const reloadWindow = () => {
    window.location.reload(); // Function to reload the window
  };

  return (
    <div>
      <FormLayout
        title="Gebruiker aanmaken"
        showIcon={false}
        showOverviewButton={isConfirmed}
        reloadWindow={reloadWindow}
      >
        {isConfirmed ? (
          <div className={styles["confirmation-container"]}>
            <p>Confirmation message here.</p>
          </div>
        ) : (
          <form>
            <div className={styles["form-group"]}>
              <h3>Info</h3>
              <label className={styles["label-email"]} htmlFor="email">
                E-mail
              </label>
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
                e-mailadres, krijgt deze gebruiker de toegewezen rechten
                (hierover wordt geen e-mail verzonden).
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
          </form>
        )}
        {!isConfirmed && (
          <FormButtons
            continueLabel="Continue"
            cancelLabel="Cancel"
            onContinue={handleSubmit}
            onCancel={() => {
              onCancel();
              reloadWindow(); // Reload when canceling the form
            }}
          />
        )}
      </FormLayout>
    </div>
  );
};

export default AddUserForm;
