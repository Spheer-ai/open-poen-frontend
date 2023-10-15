import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import styles from "../../assets/scss/Login.module.scss";
import { usePermissions } from "../../contexts/PermissionContext";

export default function Login({ onLogin }: { onLogin: () => void }) {
  const { login, user, isLoading } = useAuth();
  const { permissions, setPermissions, fetchPermissions } = usePermissions();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailValidationError, setEmailValidationError] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const navigate = useNavigate();
  const intl = useIntl();

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

  useEffect(() => {
    if (user && user.token) {
      const fetchAndSetPermissions = async () => {
        const fetchedPermissions = await fetchPermissions(
          undefined,
          user.token || undefined,
        );
        if (fetchedPermissions) {
          setPermissions(fetchedPermissions);
        }
      };
      fetchAndSetPermissions();
    }
  }, [user, fetchPermissions, setPermissions]);

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
              <img src="/open-poen-logo-gradient.svg" alt="Project Logo" />
            </div>
            <div className={styles["project-title"]}>
              <img src="/login-openpoen-logo.svg" alt="Project Name" />
            </div>
            <div className={styles["input-container"]}>
              <span className={styles["icon"]}>
                <img
                  src="/input-username.svg"
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
                  src="/input-password.svg"
                  alt="Wachtwoord"
                  width="20"
                  height="20"
                />
              </span>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              className={styles["login-button"]}
              onClick={handleFormSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Inloggen..." : "Login"}
            </button>

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
