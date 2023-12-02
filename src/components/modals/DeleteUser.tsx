import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import { deleteUser } from "../middleware/Api";

interface DeleteUserProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onUserDeleted: () => void;
  userId?: string;
}

const DeleteUser: React.FC<DeleteUserProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  onUserDeleted,
  userId,
}) => {
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

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is not available in localStorage");
        return;
      }
      if (!userId) {
        console.error("User ID is missing");
        return;
      }
      await deleteUser(userId, token);
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
    <>
      <div
        className={`${styles.backdrop} ${modalIsOpen ? styles.open : ""}`}
        onClick={handleClose}
      ></div>
      <div className={`${styles.modal} ${modalIsOpen ? styles.open : ""}`}>
        <h2 className={styles.title}>Gebruiker verwijderen</h2>
        <hr />
        <div className={styles.formGroup}>
          <h3>Info</h3>
          <p>
            Je staat op het punt deze gebruiker te verwijderen. Dit kan niet
            ongedaan gemaakt worden. Weet je het zeker?
          </p>
        </div>
        <div className={styles.buttonContainer}>
          <button onClick={handleClose} className={styles.cancelButton}>
            Annuleren
          </button>
          <button onClick={handleDelete} className={styles.deleteButton}>
            Verwijderen
          </button>
        </div>
      </div>
    </>
  );
};

export default DeleteUser;
