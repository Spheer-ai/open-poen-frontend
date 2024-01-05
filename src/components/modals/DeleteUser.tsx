import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { DeleteUserFormProps } from "../../types/DeleteUserForm";
import { deleteUser } from "../middleware/Api";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";

const DeleteUserForm: React.FC<DeleteUserFormProps> = ({
  userId,
  isOpen,
  onClose,
  isBlockingInteraction,
  onUserDeleted,
}) => {
  const { user } = useAuth();
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setModalIsOpen(true);
    } else {
      setTimeout(() => {
        setModalIsOpen(false);
      }, 300);
    }
  }, [isOpen]);

  if (!userId) {
    console.error("userId is undefined or null");
    return null;
  }

  const handleDelete = async () => {
    try {
      const token = user?.token || "";
      const response = await deleteUser(userId, token);
      onUserDeleted();
      handleClose();
    } catch (error) {
      console.error("Failed to delete user:", error);
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
    <div>
      <div
        className={`${styles.backdrop} ${modalIsOpen ? styles.open : ""}`}
        onClick={handleClose}
      ></div>
      <div className={`${styles.modal} ${modalIsOpen ? styles.open : ""}`}>
        <h2 className={styles.title}>Gebruiker verwijderen</h2>
        <hr></hr>
        <form>
          <div className={styles.formGroup}>
            <h3>Info</h3>
            <p>
              Je staat op het punt deze gebruiker te verwijderen. Dit kan niet
              ongedaan gemaakt worden. Weet je het zeker?
            </p>
          </div>
        </form>
        <div className={styles.buttonContainer}>
          <button onClick={handleClose} className={styles.cancelButton}>
            Annuleren
          </button>
          <button onClick={handleDelete} className={styles.deleteButton}>
            Opslaan
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserForm;
