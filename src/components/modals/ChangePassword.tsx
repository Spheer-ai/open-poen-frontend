import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { updateUser } from "../middleware/Api";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import useCachedImages from "../utils/images";

const ChangePasswordForm = ({
  onClose,
  userId,
  isOpen,
  isBlockingInteraction,
  onPasswordChanged,
}) => {
  const { user } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const images = useCachedImages();

  useEffect(() => {
    if (isOpen) {
      setModalIsOpen(true);
    } else {
      setTimeout(() => {
        setModalIsOpen(false);
      }, 300);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    try {
      const token = user?.token || "";

      if (newPassword !== confirmPassword) {
        setError("Wachtwoorden komt niet overeen");
        return;
      } else {
        setError(null);
      }

      const formData = {
        password: newPassword,
      };

      await updateUser(userId, formData, token);

      onPasswordChanged();
      handleClose();
    } catch (error) {
      console.error("Failed to change password:", error);
      setError("Failed to change password. Please try again.");
    }
  };

  const handleClose = () => {
    if (!isBlockingInteraction) {
      setModalIsOpen(false);
      onClose();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (!isOpen && !modalIsOpen) {
    return null;
  }

  return (
    <>
      <div
        className={`${styles.backdrop} ${modalIsOpen ? styles.open : ""}`}
        onClick={handleClose}
      ></div>
      <div className={`${styles.modal} ${modalIsOpen ? styles.open : ""}`}>
        <div className={styles.formTop}>
          <h2 className={styles.title}>Wachtwoord wijzigen</h2>
          <button onClick={handleClose} className={styles.closeBtn}>
            <img src={images.close} alt="Close Icon" />
          </button>
        </div>
        <hr></hr>
        <form>
          <div className={styles.formGroup}>
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
                  src={showPassword ? images.show : images.hide}
                  alt="Toggle Password Visibility"
                  className={styles["eye-icon"]}
                />
              </span>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles["label-email"]}>
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
                  src={showPassword ? images.show : images.hide}
                  alt="Toggle Password Visibility"
                  className={styles["eye-icon"]}
                />
              </span>
              {error && (
                <p style={{ color: "red", display: "block", marginTop: "5px" }}>
                  {error}
                </p>
              )}
            </div>
          </div>
        </form>
        <div className={styles.buttonContainer}>
          <button onClick={handleClose} className={styles.cancelButton}>
            Annuleren
          </button>
          <button onClick={handleSubmit} className={styles.saveButton}>
            Opslaan
          </button>
        </div>
      </div>
    </>
  );
};

export default ChangePasswordForm;
