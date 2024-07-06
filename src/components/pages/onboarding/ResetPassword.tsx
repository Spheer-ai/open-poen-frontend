import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { resetPassword, requestPasswordReset } from "../../middleware/Api";
import styles from "../../../assets/scss/layout/ResetPasswordLayout.module.scss";
import useCachedImages from "../../utils/images";

function ResetPassword() {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState("request");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const images = useCachedImages();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setError("Er is iets mis gegaan. Vraag een nieuwe link aan");
    } else {
      setStep("submit");
    }
  }, [location.search]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      if (step === "request") {
        await requestPasswordReset(email);
        setStep("confirmation");
      } else if (step === "submit") {
        if (password !== confirmPassword) {
          setError("Wachtwoorden komen niet overeen.");
          return;
        }

        const urlSearchParams = new URLSearchParams(location.search);
        const token = urlSearchParams.get("token");

        if (!token) {
          setError("Invalid or missing token");
          return;
        }

        await resetPassword(token, password);
        setStep("confirmation");
      }
    } catch (error) {
      console.error("Password reset error:", error);
      setError(
        "Er is een onbekende fout opgetreden bij het aanpassen van het wachtwoord.",
      );
    }
  };

  useEffect(() => {
    if (step === "confirmation") {
      const redirectTimer = setTimeout(() => {
        window.location.href = "/login";
      }, 5000);

      return () => clearTimeout(redirectTimer);
    }
  }, [step]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
        <h3>Account aanmaken</h3>
        {step === "request" && (
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
            <button
              className={styles["continue-button"]}
              onClick={handleSubmit}
            >
              Verstuur link
            </button>
          </>
        )}
        {step === "submit" && (
          <>
            <div className={styles["form-group"]}>
              <label htmlFor="password">Wachtwoord:</label>
              <div className={styles["password-container"]}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <span
                  className={styles["toggle-password"]}
                  onClick={togglePasswordVisibility}
                >
                  <img
                    src={showPassword ? "{images.hide}" : "{images.show}"}
                    alt="Toggle Password Visibility"
                  />
                </span>
              </div>
            </div>

            <div className={styles["form-group"]}>
              <label htmlFor="confirmPassword">Bevestig wachtwoord:</label>
              <div className={styles["password-container"]}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                />
                <span
                  className={styles["toggle-password"]}
                  onClick={toggleConfirmPasswordVisibility}
                >
                  <img
                    src={
                      showConfirmPassword ? "{images.hide}" : "{images.show}"
                    }
                    alt="Toggle Password Visibility"
                  />
                </span>
              </div>
            </div>
            {error && <div className={styles["error"]}>{error}</div>}
            <button
              className={styles["continue-button"]}
              onClick={handleSubmit}
            >
              Wachtwoord instellen
            </button>
          </>
        )}
        {step === "confirmation" && (
          <div>
            <p>Wachtwoord succesvol aangemaakt.</p>
            <p>Je wordt over 5 seconden doorgestuurd naar de inlogpagina.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
