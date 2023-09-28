import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../assets/scss/EditUserForm.module.scss";
import FormButtons from "./buttons/FormButton";
import FormLayout from "./FormLayout";
import { useAuth } from "../../contexts/AuthContext";
import { EditUserFormProps } from "../../types/EditUserFormType";

const EditUserForm: React.FC<EditUserFormProps> = ({
  userId,
  onCancel,
  onContinue
}) => {
  const { user } = useAuth();
  const [isConfirmed, setIsConfirmed] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    role: "",
    is_active: false,
    hidden: false,
  });

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const token = user?.token || "";
      const response = await axios.get(`/api/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const userData = response.data;

      setFormData({
        email: userData.email,
        role: userData.role,
        is_active: userData.is_active,
        hidden: userData.hidden,
      });
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    try {
      const token = user?.token || "";

      const response = await axios.patch(`/api/user/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("User updated:", response.data);

      setIsConfirmed(true);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const reloadWindow = () => {
    window.location.reload(); // Function to reload the window
  };

  return (
    <div>
      <FormLayout
        title={`Bewerk ${"gebruiker"}`}
        showIcon={false}
        showOverviewButton={isConfirmed}
        reloadWindow={reloadWindow} // Pass the showOverviewButton prop
      >
        {isConfirmed ? (
          <div>
            <p>Confirmation message here.</p>
          </div>
        ) : (
          <form>
            <h3>Info</h3>
            <div className={styles["form-group"]}>
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
            </div>
            <hr />
          <div className={styles["form-group"]}>
            <h3>Rol</h3>
            <div className={styles["form-group-roles"]}>
              <label>
                <input
                  type="checkbox"
                  name="role"
                  value="administrator"
                  checked={formData.role === "administrator"}
                  onChange={handleChange}
                />
                Beheerder
              </label>
              <label>
                <input
                  type="checkbox"
                  name="role"
                  value="user"
                  checked={formData.role === "user"}
                  onChange={handleChange}
                />
                Gebruiker
              </label>
              <label>
                <input
                  type="checkbox"
                  name="role"
                  value="financial"
                  checked={formData.role === "financial"}
                  onChange={handleChange}
                />
                Financieel
              </label>
            </div>
          </div>
          <div className={styles["form-group"]}>
            <h3>Instellingen</h3>
            <div className={styles["form-group-roles"]}>
              <label>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                />
                Initiatiefaccount is actief
              </label>
              <label>
                <input
                  type="checkbox"
                  name="hidden"
                  checked={formData.hidden}
                  onChange={handleChange}
                />
                Gebruiker verbergen in overzicht
              </label>
            </div>
          </div>
        </form>
        )}
        {!isConfirmed && (
          <FormButtons
            continueLabel="Save"
            cancelLabel="Cancel"
            onContinue={handleSubmit}
            onCancel={() => {
              onCancel();
              reloadWindow(); // Reload when canceling the form
            }}
          />
        )}
      </FormLayout>
    </div>
  );
};

export default EditUserForm;
