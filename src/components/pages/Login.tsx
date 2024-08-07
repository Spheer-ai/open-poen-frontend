import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import styles from "../../assets/scss/Login.module.scss";
import useCachedImages from "../utils/images";

export default function Login({ onLogin }: { onLogin: () => void }) {
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailValidationError, setEmailValidationError] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const navigate = useNavigate();
  const intl = useIntl();
  const [showPassword, setShowPassword] = useState(false);
  const images = useCachedImages([
    "logoGradient",
    "logoLogin",
    "inputUsername",
    "inputPassword",
    "hidePass",
    "show",
  ]);

  const handleLogin = async () => {
    try {
      if (!username.trim()) {
        setError(intl.formatMessage({ id: "auth.emptyEmail" }));
        return;
      }

      const success = await login(username, password);

      if (success) {
        onLogin();
      } else {
        setError(intl.formatMessage({ id: "auth.usernamePasswordRequired" }));
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(intl.formatMessage({ id: "auth.badCredentials" }));
      } else {
        setError(intl.formatMessage({ id: "auth.genericError" }));
      }
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setUsername(email);

    if (formSubmitted) {
      if (!validateEmail(email)) {
        setEmailValidationError("auth.emailValidation");
      } else {
        setEmailValidationError("");
      }
    }
  };

  const handleBackdropClick = () => {
    navigate("/funds");
  };

  const handleFormSubmit = () => {
    setFormSubmitted(true);

    handleLogin();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFormSubmit();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles["login-modal"]}>
      <div
        className={styles["login-modal-backdrop"]}
        onClick={handleBackdropClick}
      ></div>
      <div className={styles["login-modal-content"]}>
        <div className={styles["login-container"]}>
          <div className={styles["login-box"]}>
            <div className={styles["logo"]}>
              <img src={images.logoGradient} alt="Project Logo" />
            </div>
            <div className={styles["project-title"]}>
              <img src={images.logoLogin} alt="Project Name" />
            </div>
            <form onSubmit={handleSubmit}>
              <div className={styles["input-container"]}>
                <span className={styles["icon"]}>
                  <img
                    src={images.inputUsername}
                    alt="Username"
                    width="20"
                    height="20"
                  />
                </span>
                <input
                  type="text"
                  placeholder="E-mailadres"
                  value={username}
                  onChange={handleEmailChange}
                />
              </div>
              <div className={styles["input-container"]}>
                <span className={styles["icon"]}>
                  <img
                    src={images.inputPassword}
                    alt="Wachtwoord"
                    width="20"
                    height="20"
                  />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className={styles["toggle-password"]}
                  onClick={togglePasswordVisibility}
                >
                  <img
                    src={showPassword ? `${images.hidePass}` : `${images.show}`}
                    alt="Toggle Password Visibility"
                  />
                </span>
              </div>
              <button
                className={styles["login-button"]}
                onClick={handleFormSubmit}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Inloggen..." : "Login"}
              </button>
            </form>
            <div className={styles["forgot-password-link"]}>
              <Link to="/account-recovery">Wachtwoord vergeten?</Link>
            </div>
            {error && <p className={styles["error-message"]}>{error}</p>}
            {formSubmitted && emailValidationError && (
              <p className={styles["error-message"]}>
                {intl.formatMessage({ id: emailValidationError })}
              </p>
            )}

            {isLoading && (
              <div className={styles["loading-animation"]}>
                <div className={styles["spinner"]}></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
