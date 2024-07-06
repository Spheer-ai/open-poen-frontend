import React, { useState } from "react";
import { requestPasswordReset } from "../../middleware/Api";
import styles from "../../../assets/scss/layout/ResetPasswordLayout.module.scss";
import useCachedImages from "../../utils/images";

function RequestPasswordRequest() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const images = useCachedImages();

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
      <div
        className={styles["modal-background"]}
        style={{
          backgroundImage: `url(${images.signupBg})`,
        }}
      ></div>
      <div className={styles["modal-content"]}>
        <div className={styles["logo"]}>
          <img src={images.logoGradient} alt="Project Logo" />
        </div>
        <div className={styles["project-title"]}>
          <img src={images.logoLogin} alt="Project Name" />
        </div>
        <h3>Wachtwoord herstellen</h3>
        {!success && (
          <>
            <p>Vraag een nieuw wachtwoord aan</p>
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
            <p>Volg de link om je wachtwoord in te stellen.</p>
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

export default RequestPasswordRequest;
