import React from "react";

const DeleteUser = ({ userId, onDelete, onCancel }) => {
  const handleConfirm = () => {
    // Perform the user deletion here, you can use an API call
    // After successful deletion, call onDelete(userId)
    onDelete(userId);
  };

  return (
    <div className="delete-user">
      <p>Are you sure you want to delete this user?</p>
      <button onClick={handleConfirm}>Confirm</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default DeleteUser;
