import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { resetPassword } from "../../middleware/Api";
import styles from "../../../assets/scss/layout/ResetPasswordLayout.module.scss";

function ResetPassword() {
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(location.search);
    const token = urlSearchParams.get("token");

    console.log("Token used in useEffect:", token);

    if (!token) {
      setError("Er is iets mis gegaan. Vraag een nieuwe link aan");
    }
  }, [location.search]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      if (password !== confirmPassword) {
        setError("Wachtwoorden komen niet overeen.");
        return;
      }

      const urlSearchParams = new URLSearchParams(location.search);
      const token = urlSearchParams.get("token");

      console.log("Token used in handleSubmit:", token);

      if (!token) {
        setError("Invalid or missing token");
        return;
      }

      await resetPassword(token, password);

      window.location.href = "/login";
    } catch (error) {
      console.error("Password reset error:", error);
      setError(
        "Er is een onbekende fout opgetreden bij het aanpassen van het wachtwoord.",
      );
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
