import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { requestPasswordReset } from "../../middleware/Api";
import styles from "../../../assets/scss/layout/ResetPasswordLayout.module.scss";

function ResetPasswordRequest() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      await requestPasswordReset(email);
      setSuccess(true);
    } catch (error) {
      console.error("Password reset request error:", error);
      setError(
        "Er is een onbekende fout opgetreden bij het aanvragen van de wachtwoordreset.",
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
        <h3>Wachtwoord Reset Aanvragen</h3>
        {!success && (
          <>
            <p>Je bent uitgenodigd. Vul je e-mailadres in om verder te gaan.</p>
            <div className={styles["form-group"]}>
              <label htmlFor="email">E-mailadres:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
          </>
        )}
        {error && <div className={styles["error"]}>{error}</div>}
        {success && (
          <div>
            <p>Er is een link naar je e-mailadres gestuurd.</p>
            <p>Volg de link om je wachtwoord te resetten.</p>
          </div>
        )}
        {!success && (
          <button className={styles["continue-button"]} onClick={handleSubmit}>
            Verstuur Link
          </button>
        )}
      </div>
    </div>
  );
}

export default ResetPasswordRequest;
