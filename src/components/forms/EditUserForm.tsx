import React, { useState, useEffect } from "react";
import styles from "../../assets/scss/EditUserForm.module.scss";
import FormButtons from "./buttons/FormButton";
import FormLayout from "./FormLayout";
import { useAuth } from "../../contexts/AuthContext";
import { EditUserFormProps } from "../../types/EditUserFormType";
import { fetchUserData, updateUserProfile } from "../middleware/Api";

const EditUserForm: React.FC<EditUserFormProps> = ({
  userId,
  onCancel,
  fieldPermissions,
}) => {
  const { user } = useAuth();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    role: "",
    is_active: false,
    hidden: false,
  });
  const [emailError, setEmailError] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserDataFromApi(userId, user?.token || "");
    }
  }, [userId]);

  const fetchUserDataFromApi = async (userId: string, token: string) => {
    try {
      const userData = await fetchUserData(token, userId);

      setFormData({
        email: userData.email,
        role: userData.role,
        is_active: userData.is_active,
        hidden: userData.hidden,
      });
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name === "role") {
        setFormData({ ...formData, role: value });
      } else {
        setFormData({ ...formData, [name]: checked });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateEmail = (email: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Vul een e-mailadres in");
    } else if (!pattern.test(email)) {
      setEmailError("Vul een geldig e-mailadres in");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async () => {
    setHasSubmitted(true);
    validateEmail(formData.email);

    if (emailError) {
      return;
    }

    try {
      const token = user?.token || "";

      if (!userId) {
        console.error("userId is null");
        return;
      }

      const response = await updateUserProfile(userId, formData, token);

      console.log("User profile updated:", response);

      setIsConfirmed(true);
    } catch (error) {
      console.error("Failed to update user profile:", error);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div>
      <FormLayout
        title={`Bewerk ${"gebruiker"}`}
        showIcon={false}
        showOverviewButton={isConfirmed}
        reloadWindow={onCancel}
      >
        {isConfirmed ? (
          <div className={styles["confirmation-container"]}>
            <h3>Accountgegevens bijgewerkt</h3>
            <p>De gegevens van de gebruiker zijn succesvol bijgewerkt.</p>
          </div>
        ) : (
          <form>
            <h3>Info</h3>
            {fieldPermissions.fields.includes("email") && (
              <div className={styles["form-group"]}>
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
                  onKeyPress={handleKeyPress}
                />
                {hasSubmitted && emailError && (
                  <p
                    style={{
                      color: "red",
                      display: "block",
                      marginTop: "5px",
                      marginBottom: "0px",
                    }}
                  >
                    {emailError}
                  </p>
                )}
              </div>
            )}
            <hr />
            {fieldPermissions.fields.includes("role") && (
              <div className={styles["form-group"]}>
                <h3>Rol</h3>
                <div className={styles["form-group-roles"]}>
                  <label>
                    <input
                      type="checkbox"
                      name="role"
                      value="administrator"
                      checked={formData.role === "administrator"}
                      onChange={handleChange}
                    />
                    Beheerder
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="role"
                      value="user"
                      checked={formData.role === "user"}
                      onChange={handleChange}
                    />
                    Gebruiker
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="role"
                      value="financial"
                      checked={formData.role === "financial"}
                      onChange={handleChange}
                    />
                    Financieel
                  </label>
                </div>
              </div>
            )}
            <div className={styles["form-group"]}>
              {fieldPermissions.fields.includes("is_active") ||
              fieldPermissions.fields.includes("hidden") ? (
                <h3>Instellingen</h3>
              ) : null}
              <div className={styles["form-group-roles"]}>
                {fieldPermissions.fields.includes("is_active") && (
                  <>
                    <label>
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                      />
                      Account is actief
                    </label>
                  </>
                )}
                {fieldPermissions.fields.includes("hidden") && (
                  <>
                    <label>
                      <input
                        type="checkbox"
                        name="hidden"
                        checked={formData.hidden}
                        onChange={handleChange}
                      />
                      Gebruiker verbergen in overzicht
                    </label>
                  </>
                )}
              </div>
            </div>
          </form>
        )}
        {!isConfirmed && (
          <FormButtons
            continueLabel="Opslaan"
            cancelLabel="Annuleren"
            onContinue={() => {
              handleSubmit();
            }}
            onCancel={handleCancel}
          />
        )}
      </FormLayout>
    </div>
  );
};

export default EditUserForm;
