import React from "react";
import "../forms/AddUserform.css";

interface AddUserFormProps {
  onContinue: () => void;
  onCancel: () => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onContinue, onCancel }) => {
  return (
    <div>
      <h2>Add User</h2>
      <hr />
      <form>
        <div className="form-group">
          <label htmlFor="email">Email Address:</label>
          <input type="email" id="email" name="email" />
          <p className="description">Enter the email address of the user.</p>
        </div>
      </form>
      <div className="button-container">
        <button className="continue-button" onClick={onContinue}>
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
