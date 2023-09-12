import React, { useState } from "react";
import axios from "axios";
import "../forms/AddUserform.css";
import { useAuth } from "../../contexts/AuthContext"; // Import the useAuth hook from your authentication context

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

  const { user } = useAuth(); // Access the authenticated user's token

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      // Perform form validation here if needed

      // Use the authenticated user's token
      const token = user?.token || ""; // Replace with your actual token or a default value

      // Send the formData to the server via Axios POST request with authentication headers
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

      // Close the modal or perform other actions
      onContinue();
    } catch (error) {
      // Handle any errors, such as validation errors or network issues
      console.error("Failed to create user:", error);
    }
  };

  return (
    <div>
      <h2>Add User</h2>
      <hr />
      <form>
        <div className="form-group">
          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <p className="description">Enter the email address of the user.</p>
        </div>
        <div className="form-group">
          <label htmlFor="first_name">First Name:</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="last_name">Last Name:</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="biography">Biography:</label>
          <input
            type="text"
            id="biography"
            name="biography"
            value={formData.biography}
            onChange={handleChange}
          />
        </div>
        {/* Add more form fields for other user data here */}
      </form>
      <div className="button-container">
        <button className="continue-button" onClick={handleSubmit}>
          Continue
        </button>
        <button className="cancel-button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddUserForm;
