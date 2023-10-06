import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { resetPassword } from "../../middleware/Api";
import { useAuth } from "../../../contexts/AuthContext";
import styles from "../../../assets/scss/layout/ResetPasswordLayout.module.scss"; // Import your CSS file for styling

function ResetPassword() {
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // New state variable for confirming password
  const [error, setError] = useState("");

  const auth = useAuth();
  const token = auth.user?.token;

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    // Handle confirm password change
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      if (!token) {
        throw new Error("User not authenticated");
      }

      // Check if passwords match
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      await resetPassword(token, password);

      // Password reset successful, you can choose to navigate to some other page
    } catch (error) {
      console.error("Password reset error:", error);
      setError("An error occurred while resetting your password.");
    }
  };

  return (
    <div className={styles["reset-password-container"]}>
      <div className={styles["modal-background"]}></div>
      <div className={styles["modal-content"]}>
        <div className={styles["logo"]}>
          <img src="/open-poen-logo-gradient.svg" alt="Project Logo" />
        </div>
        <div className={styles["project-title"]}>
          <img src="/login-openpoen-logo.svg" alt="Project Name" />
        </div>
        <h3>Account aanmaken</h3>
        <p>Je bent uitgenodigd vul de gegevens in voordat je verder kunt.</p>
        <div className={styles["form-group"]}>
          <label htmlFor="password">Wachtwoord:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <div className={styles["form-group"]}>
          <label htmlFor="confirmPassword">Bevestig wachtwoord:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
        </div>
        {error && <div className={styles["error"]}>{error}</div>}
        <button className={styles["continue-button"]} onClick={handleSubmit}>
          Wachtwoord instellen
        </button>
      </div>
    </div>
  );
}

export default ResetPassword;
