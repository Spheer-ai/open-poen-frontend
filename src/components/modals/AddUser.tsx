import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import { createUser } from "../middleware/Api";

export type UserFormData = {
  email: string;
  first_name: string;
  last_name: string;
  biography: string;
  role: string[];
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
  hidden: boolean;
};

const initialFormData: UserFormData = {
  email: "",
  first_name: "",
  last_name: "",
  biography: "",
  role: [],
  is_active: true,
  is_superuser: false,
  is_verified: true,
  hidden: false,
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
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState<string | null>(null);

  const roleLabels = {
    administrator: "Beheerder",
    financial: "Financieel",
    user: "Gebruiker",
  };

  useEffect(() => {
    if (isOpen) {
      setModalIsOpen(true);
    } else {
      setTimeout(() => {
        setModalIsOpen(false);
      }, 300);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRoleChange = (checked: boolean) => {
    setFormData((prevFormData: UserFormData) => {
      // Clone the existing role array and add/remove the selected role
      const updatedRole: string[] = checked
        ? [...prevFormData.role, "user"] // Add role to the array
        : prevFormData.role.filter((r) => r !== "user"); // Remove role from the array

      return {
        ...prevFormData,
        role: updatedRole,
      };
    });
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    role: string,
  ) => {
    const { checked } = e.target;
    setFormData((prevFormData: UserFormData) => {
      // Clone the existing role array and add/remove the selected role
      const updatedRoles: string[] = checked
        ? [...prevFormData.role, role] // Add role to the array
        : prevFormData.role.filter((r) => r !== role); // Remove role from the array

      return {
        ...prevFormData,
        role: updatedRoles,
      };
    });
  };

  const handleSave = async () => {
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
      console.log("User created:", response);

      handleClose();
      onUserAdded();
    } catch (error) {
      console.error("Failed to create user:", error);
      setError("Failed to create user. Please try again.");
    }
  };

  const handleClose = () => {
    if (!isBlockingInteraction) {
      setModalIsOpen(false);
      onClose();
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
        <h2 className={styles.title}>Gebruiker aanmaken</h2>
        <hr></hr>
        <form>
          <div className={styles.formGroup}>
            <h3>Info</h3>
            <label className={styles.labelEmail} htmlFor="email">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Voer het e-mailadres in"
              value={formData.email}
              onChange={handleChange}
            />
            {error && <p className={styles.error}>{error}</p>}
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
                    name={apiRole} // Use a unique name for each checkbox
                    checked={formData.role.includes(apiRole)} // Check if the role is in the array
                    onChange={(e) => handleCheckboxChange(e, apiRole)} // Pass the role as a parameter
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
