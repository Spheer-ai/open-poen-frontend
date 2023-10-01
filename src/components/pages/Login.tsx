import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import styles from "../../assets/scss/Login.module.scss";

export default function Login({
  onLogin,
}: {
  onLogin: () => void;
}) {
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async () => {
    try {
      const success = await login(username, password);

      if (success) {
        onLogin();
      } else {
        setError("Verkeerde gebruikersnaam en wachtwoord");
      }
    } catch (error) {
      setError(
        error.message || "Er is een fout opgetreden tijdens het inloggen."
      );
    }
  };

  const handleBackdropClick = () => {
    // Trigger the onClose function when the backdrop is clicked
    navigate("/funds"); // Redirect to the "funds" page
  };

  return (
    <div className={styles["login-modal"]}>
            <div className={styles["login-modal-backdrop"]} onClick={handleBackdropClick}></div>
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
                onChange={(e) => setUsername(e.target.value)}
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
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? "Inloggen..." : "Login"}
            </button>

            {error && <p className={styles["error-message"]}>{error}</p>}

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
