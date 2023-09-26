import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../assets/scss/EditUserForm.module.scss";
import { useAuth } from "../../contexts/AuthContext";
import { EditUserFormProps } from "../../types/EditUserFormType";
import FormButtons from "./buttons/FormButton";
import FormLayout from "./FormLayout";

const EditUserForm: React.FC<EditUserFormProps> = ({
  userId,
  onCancel,
  onContinue
}) => {
  const { user } = useAuth();
  console.log("User ID:", userId);

  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    biography: "",
    role: "user",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = user?.token || "";
        const response = await axios.get(
          `http://127.0.0.1:8000/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        const userData = response.data;

        setFormData({
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          biography: userData.biography,
          role: userData.role,
        });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, [user?.token, userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const token = user?.token || "";

      const response = await axios.patch(
        `http://127.0.0.1:8000/user/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("User updated:", response.data);
      onContinue();
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  return (
    <div>
<FormLayout title={`Bewerk ${formData.first_name ? formData.first_name : 'E-mailadres'}`}>
      <form>
        <div className={styles["form-group"]}>
          <label htmlFor="first_name">First Name:</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />
        </div>
        <div className={styles["form-group"]}>
          <label htmlFor="last_name">Last Name:</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
        </div>
        <div className={styles["form-group"]}>
          <label htmlFor="role">Role:</label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          />
        </div>
        <div className={styles["form-group"]}>
          <label htmlFor="biography">Biography:</label>
          <input
            type="text"
            id="biography"
            name="biography"
            value={formData.biography}
            onChange={handleChange}
          />
        </div>
      </form>
      <FormButtons
        continueLabel="Save" // Customize the button labels here
        cancelLabel="Cancel"
        onContinue={handleSubmit}
        onCancel={onCancel}
      />
    </FormLayout>
    </div>
  );
};

export default EditUserForm;
