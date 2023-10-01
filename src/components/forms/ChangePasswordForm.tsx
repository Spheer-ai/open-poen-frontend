import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { updateUser } from "../middleware/Api";
import styles from "../../assets/scss/ChangePasswordForm.module.scss";
import FormButtons from "./buttons/FormButton";
import FormLayout from "./FormLayout";

const ChangePasswordForm = ({ onClose, userId }) => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleCancel = () => {
    onClose();
    window.location.reload();
  };

  const handleSubmit = async () => {
    try {
      const token = user?.token || "";

      if (newPassword !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      const formData = new FormData();
      formData.append("password", newPassword);

      await updateUser(userId, formData, token, currentPassword, newPassword);

      setIsConfirmed(true);
    } catch (error) {
      console.error("Failed to change password:", error);
      setError("Failed to change password. Please try again.");
    }
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
            <h3>Info</h3>
            <div className={styles["form-group"]}>
              <label
                htmlFor="currentPassword"
                className={styles["label-email"]}
              >
                Huidig wachtwoord:
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className={styles["input"]}
              />
            </div>
            <div className={styles["form-group"]}>
              <label htmlFor="newPassword" className={styles["label-email"]}>
                Nieuw wachtwoord:
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className={styles["input"]}
              />
            </div>
            <div className={styles["form-group"]}>
              <label
                htmlFor="confirmPassword"
                className={styles["label-email"]}
              >
                Bevestig nieuwe wachtwoord:
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={styles["input"]}
              />
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
