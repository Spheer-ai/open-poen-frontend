import React from "react";
import styles from "../../../assets/scss/DeleteUser.module.scss";

const DeleteUser = ({ userId, onDelete, onCancel }) => {
  const handleConfirm = () => {
    onDelete(userId);
  };

  return (
    <div className={styles["delete-user"]}>
      <p>Are you sure you want to delete this user?</p>
      <button onClick={handleConfirm}>Confirm</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default DeleteUser;
