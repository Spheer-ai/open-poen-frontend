import React, { useState } from "react";
import styles from "../../assets/scss/AddUserForm.module.scss";
import { useAuth } from "../../contexts/AuthContext";
import FormButtons from "./buttons/FormButton";
import FormLayout from "./FormLayout";
import { createUser } from "../middleware/Api";
import { useIntl } from "react-intl";

export type UserFormData = {
  email: string;
  first_name: string;
  last_name: string;
  biography: string;
  role: string;
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
  role: "",
  is_active: true,
  is_superuser: false,
  is_verified: true,
  hidden: false,
};

const AddUserForm: React.FC<{
  onContinue: () => void;
  onCancel: () => void;
}> = ({ onCancel }) => {
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const { user } = useAuth();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState<string>("");
  const intl = useIntl();

  const roleLabels = {
    administrator: "Beheerder",
    financial: "Financieel",
    user: "Gebruiker",
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      role: checked ? name : "",
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (!formData.email.trim()) {
        setError(intl.formatMessage({ id: "auth.emptyEmail" }));
        return;
      }

      if (!formData.role) {
        setError(intl.formatMessage({ id: "addUser.SelectRole" }));
        return;
      }

      const token = user?.token || "";

      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      const response = await createUser(formDataToSend, token);
      console.log("User created:", response);

      setIsConfirmed(true);
    } catch (error) {
      if (error.response) {
        const status = error.response.status;

        if (status === 422) {
          setError(intl.formatMessage({ id: "auth.emailValidation" }));
        } else if (status === 400) {
          setError(intl.formatMessage({ id: "addUser.AlreadyExist" }));
        } else {
          console.error("Failed to create user:", error);
        }
      } else {
        console.error("Failed to create user:", error);
      }
    }
  };

  const handleConfirmAction = () => {
    setIsConfirmed(true);
  };

  return (
    <div>
      <FormLayout
        title="Gebruiker aanmaken"
        showIcon={false}
        showOverviewButton={isConfirmed}
        reloadWindow={() => {
          onCancel();
          setTimeout(() => {
            window.location.reload();
          }, 300);
        }}
      >
        {isConfirmed ? (
          <div>
            <h3>Gebruiker succesvol aangemaakt</h3>
            <p>
              De gebruiker is succesvol aangemaakt. We hebben een e-mail met
              instructies voor accountactivatie naar de gebruiker gestuurd en
              een rol toegewezen. De gebruiker moet zijn e-mailadres verifiëren
              voordat hij het account kan gebruiken.
            </p>
          </div>
        ) : (
          <form>
            <div className={styles["form-group"]}>
              <h3>Info</h3>
              <label className={styles["label-email"]} htmlFor="email">
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
              {error && <p className={styles["error-message"]}>{error}</p>}
              <p className={styles["description"]}>
                Als er nog geen gebruiker bestaat met dit e-mailadres, ontvangt
                deze een uitnodigingsmail met daarin een link om een wachtwoord
                aan te maken. Indien er al een gebruiker bestaat met dit
                e-mailadres, krijgt deze gebruiker de toegewezen rechten
                (hierover wordt geen e-mail verzonden).
              </p>
              <hr />
            </div>
            <div className={styles["form-group"]}>
              <h3>Rol</h3>
              <div className={styles["role-options"]}>
                {Object.entries(roleLabels).map(([apiRole, displayRole]) => (
                  <label key={apiRole} className={styles["role-label"]}>
                    <input
                      type="checkbox"
                      name={apiRole}
                      checked={formData.role === apiRole}
                      onChange={handleCheckboxChange}
                    />
                    {displayRole}
                  </label>
                ))}
              </div>
            </div>
          </form>
        )}
        {!isConfirmed && (
          <FormButtons
            continueLabel="Opslaan"
            cancelLabel="Annuleren"
            onContinue={() => {
              if (isConfirmed) {
                handleConfirmAction();
              } else {
                handleSubmit();
              }
            }}
            onCancel={() => {
              onCancel();
            }}
          />
        )}
      </FormLayout>
    </div>
  );
};

export default AddUserForm;
