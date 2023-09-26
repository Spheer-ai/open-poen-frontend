import React from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { DeleteUserFormProps } from "../../types/DeleteUserForm";
import styles from "../../assets/scss/DeleteUserForm.module.scss";
import FormButtons from "./buttons/FormButton";
import FormLayout from "./FormLayout";

const DeleteUserForm: React.FC<DeleteUserFormProps> = ({
  userId,
  onCancel,
  onContinue
}) => {
  const { user } = useAuth();
  console.log("User ID:", userId);

  if (!userId) {
    console.error("userId is undefined or null");
    return null; // You can return an error message or handle this case accordingly
  }

  const handleDelete = async () => {
    try {
      const token = user?.token || "";

      const response = await axios.delete(
        `http://127.0.0.1:8000/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("User deleted:", response.data);
      onContinue();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <div>
    <FormLayout title="Delete User">
      <p>Are you sure you want to delete this user?</p>
      <FormButtons
        continueLabel="Delete" // Customize the button labels here
        cancelLabel="Cancel"
        onContinue={handleDelete}
        onCancel={onCancel}
      />
    </FormLayout>
    </div>
  );
};

export default DeleteUserForm;
