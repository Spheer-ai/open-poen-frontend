import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import { createUser } from "../middleware/Api";
import useCachedImages from "../utils/images";

const roleLabels = {
  administrator: "Beheerder",
  financial: "Financieel",
  user: "Gebruiker",
};

interface AddUserProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onUserAdded: () => void;
}

const AddUser: React.FC<AddUserProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  onUserAdded,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    biography: "",
    role: "user",
    is_active: true,
    is_superuser: false,
    is_verified: true,
    hidden: false,
  });
  const [error, setError] = useState<string | null>(null);
  const images = useCachedImages();

  useEffect(() => {
    if (isOpen) {
      setModalIsOpen(true);
    } else {
      setTimeout(() => {
        setModalIsOpen(false);
        setFormData({
          email: "",
          first_name: "",
          last_name: "",
          biography: "",
          role: "user",
          is_active: true,
          is_superuser: false,
          is_verified: true,
          hidden: false,
        });
      }, 300);
      setError(null);
    }
  }, [isOpen]);

  const isValidEmail = (email: string) => {
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailPattern.test(email);
  };

  const handleSave = async () => {
    if (!formData.email.trim()) {
      setError("Voer een e-mailadres in.");
      return;
    }

    if (!isValidEmail(formData.email)) {
      setError("Voer een geldig e-mailadres in.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is not available in localStorage");
        return;
      }

      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      const response = await createUser(formDataToSend, token);

      handleClose();
      onUserAdded();
    } catch (error) {
      console.error("Failed to create user:", error);

      if (error.response && error.response.status === 409) {
        setError("Gebruiker reeds bekend");
      } else {
        setError(
          "Er is een fout opgetreden bij het aanmaken van de gebruiker.",
        );
      }
    }
  };

  const handleRoleChange = (selectedRole: string) => {
    setFormData({
      ...formData,
      role: selectedRole.toLowerCase(),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleClose = () => {
    if (!isBlockingInteraction) {
      setModalIsOpen(false);
      onClose();
    }
  };

  const handleEnterKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSave();
    }
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
          <h2 className={styles.title}>Gebruiker aanmaken</h2>
          <button onClick={handleClose} className={styles.closeBtn}>
            <img src={images.close} alt="Close Icon" />
          </button>
        </div>
        <hr></hr>
        <form>
          <div className={styles.formGroup}>
            <h3>Info</h3>
            <label className={styles["label-first_name"]} htmlFor="first_name">
              Voornaam
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              placeholder="Voer de voornaam in"
              value={formData.first_name}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.labelField} htmlFor="email">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Voer het e-mailadres in"
              value={formData.email}
              onChange={handleChange}
              onKeyDown={handleEnterKeyPress}
            />
            {error && (
              <span
                style={{ color: "red", display: "block", marginTop: "5px" }}
              >
                {error}
              </span>
            )}
            <p className={styles.description}>
              Als er nog geen gebruiker bestaat met dit e-mailadres, ontvangt
              deze een uitnodigingsmail met daarin een link om een wachtwoord
              aan te maken. Indien er al een gebruiker bestaat met dit
              e-mailadres, krijgt deze gebruiker de toegewezen rechten (hierover
              wordt geen e-mail verzonden).
            </p>
            <hr />
          </div>
          <div className={styles.formGroup}>
            <h3>Rol</h3>
            <div className={styles.roleOptions}>
              {Object.entries(roleLabels).map(([apiRole, displayRole]) => (
                <label key={apiRole} className={styles.roleLabel}>
                  <input
                    type="checkbox"
                    name="role"
                    value={apiRole.toLowerCase()}
                    checked={formData.role === apiRole.toLowerCase()}
                    onChange={() => handleRoleChange(apiRole)}
                  />
                  {displayRole}
                </label>
              ))}
            </div>
          </div>
        </form>
        <div className={styles.buttonContainer}>
          <button onClick={handleClose} className={styles.cancelButton}>
            Annuleren
          </button>
          <button onClick={handleSave} className={styles.saveButton}>
            Opslaan
          </button>
        </div>
      </div>
    </>
  );
};

export default AddUser;
