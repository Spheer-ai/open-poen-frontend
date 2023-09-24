import React, { useState } from "react";
import axios from "axios";
import styles from "../forms/AddUserform.module.scss";
import { useAuth } from "../../contexts/AuthContext";

interface AddUserFormProps {
  onContinue: () => void;
  onCancel: () => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onContinue, onCancel }) => {
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

  const { user } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const token = user?.token || "";

      const response = await axios.post(
        "http://127.0.0.1:8000/user",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("User created:", response.data);

      onContinue();
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  return (
    <div>
      <h2>Add User</h2>
      <hr />
      <form>
        <div className={styles["form-group"]}>
          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <p className={styles["description"]}>
            Enter the email address of the user.
          </p>
        </div>
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
      <div className={styles["button-container"]}>
        <button className={styles["continue-button"]} onClick={handleSubmit}>
          Continue
        </button>
        <button className={styles["cancel-button"]} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddUserForm;
