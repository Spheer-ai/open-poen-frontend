import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { updateUser } from "../middleware/Api";
import styles from "../../assets/scss/ChangePasswordForm.module.scss";
import FormButtons from "./buttons/FormButton";
import FormLayout from "./FormLayout";

const ChangePasswordForm = ({ onClose, userId }) => {
  const { user } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleCancel = () => {
    onClose();
  };

  const handleSubmit = async () => {
    try {
      const token = user?.token || "";

      if (newPassword !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      const formData = {
        password: newPassword,
      };

      await updateUser(userId, formData, token);

      setIsConfirmed(true);
    } catch (error) {
      console.error("Failed to change password:", error);
      setError("Failed to change password. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles["form-container"]}>
      <FormLayout
        title="Wachtwoord wijzigen"
        showIcon={false}
        showOverviewButton={isConfirmed}
        reloadWindow={handleCancel}
      >
        {isConfirmed ? (
          <div className={styles["confirmation-container"]}>
            <h3>Wachtwoord bijgewerkt</h3>
            <p>Het wachtwoord van de gebruiker is succesvol bijgewerkt.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles["change-pass-form"]}>
            <div className={styles["form-group"]}>
              <label htmlFor="newPassword" className={styles["label-email"]}>
                Nieuw wachtwoord:
              </label>
              <div className={styles["password-container"]}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className={styles["input"]}
                />
                <span
                  className={styles["toggle-password"]}
                  onClick={togglePasswordVisibility}
                >
                  <img
                    src={
                      showPassword
                        ? "/eye-open-icon.svg"
                        : "/eye-closed-icon.svg"
                    }
                    alt="Toggle Password Visibility"
                    className={styles["eye-icon"]}
                  />
                </span>
              </div>
            </div>
            <div className={styles["form-group"]}>
              <label
                htmlFor="confirmPassword"
                className={styles["label-email"]}
              >
                Bevestig nieuwe wachtwoord:
              </label>
              <div className={styles["password-container"]}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={styles["input"]}
                />
                <span
                  className={styles["toggle-password"]}
                  onClick={togglePasswordVisibility}
                >
                  <img
                    src={
                      showPassword
                        ? "/eye-open-icon.svg"
                        : "/eye-closed-icon.svg"
                    }
                    alt="Toggle Password Visibility"
                    className={styles["eye-icon"]}
                  />
                </span>
              </div>
            </div>
            {!isConfirmed && (
              <FormButtons
                continueLabel="Opslaan"
                cancelLabel="Annuleren"
                onContinue={handleSubmit}
                onCancel={handleCancel}
              />
            )}
          </form>
        )}
      </FormLayout>
    </div>
  );
};

export default ChangePasswordForm;
