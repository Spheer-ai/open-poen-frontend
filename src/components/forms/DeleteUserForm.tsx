import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { DeleteUserFormProps } from "../../types/DeleteUserForm";
import FormButtons from "./buttons/FormButton";
import FormLayout from "./FormLayout";
import { deleteUser } from "../middleware/Api";

const DeleteUserForm: React.FC<DeleteUserFormProps> = ({
  userId,
  onCancel,
  onContinue,
}) => {
  const { user } = useAuth();

  if (!userId) {
    console.error("userId is undefined or null");
    return null;
  }

  const handleDelete = async () => {
    try {
      const token = user?.token || "";
      const response = await deleteUser(userId, token);
      console.log("User deleted:", response);
      onContinue();
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <div>
      <FormLayout title="Delete User" showIcon={true}>
        <p>
          Je staat op het punt deze gebruiker te verwijderen. Dit kan niet
          ongedaan gemaakt worden. Weet je het zeker?
        </p>
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
