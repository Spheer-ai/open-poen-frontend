import React from "react";
import styles from "../../../assets/scss/FormButton.module.scss"; // Define your button styles here

interface FormButtonsProps {
  continueLabel: string;
  cancelLabel: string;
  onContinue: () => void;
  onCancel: () => void;
}

const FormButtons: React.FC<FormButtonsProps> = ({
  continueLabel,
  cancelLabel,
  onContinue,
  onCancel,
}) => {
  return (
    <div className={styles["button-container"]}>
      <button className={styles["continue-button"]} onClick={onContinue}>
        {continueLabel}
      </button>
      <button className={styles["cancel-button"]} onClick={onCancel}>
        {cancelLabel}
      </button>
    </div>
  );
};

export default FormButtons;
