import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { DeleteUserFormProps } from "../../types/DeleteUserForm";
import FormButtons from "./buttons/FormButton";
import FormLayout from "./FormLayout";
import { deleteUser } from "../middleware/Api";
import styles from "../../assets/scss/DeleteUserForm.module.scss";

const DeleteUserForm: React.FC<DeleteUserFormProps> = ({
  userId,
  onCancel,
}) => {
  const { user } = useAuth();
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!userId) {
    console.error("userId is undefined or null");
    return null;
  }

  const handleDelete = async () => {
    try {
      const token = user?.token || "";
      const response = await deleteUser(userId, token);
      console.log("User deleted:", response);
      setIsConfirmed(true);
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <div>
      <FormLayout
        title="Gebruiker verwijderen"
        showIcon={true}
        showOverviewButton={isConfirmed}
        reloadWindow={onCancel}
      >
        {isConfirmed ? (
          <div className={styles["confirmation-container"]}>
            <h3>Gebruiker succesvol verwijderd</h3>
            <p>
              De gebruiker is verwijderd en kan geen gebruik meer maken van het
              account.
            </p>
          </div>
        ) : (
          <p>
            Je staat op het punt deze gebruiker te verwijderen. Dit kan niet
            ongedaan gemaakt worden. Weet je het zeker?
          </p>
        )}
        {!isConfirmed && (
          <FormButtons
            continueLabel="Doorgaan"
            cancelLabel="Annuleren"
            onContinue={handleDelete}
            onCancel={onCancel}
          />
        )}
      </FormLayout>
    </div>
  );
};

export default DeleteUserForm;
