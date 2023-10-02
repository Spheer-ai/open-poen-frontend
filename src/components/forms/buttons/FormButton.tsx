import React from "react";
import styles from "../../../assets/scss/FormButton.module.scss";

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
      <button className={styles["cancel-button"]} onClick={onCancel}>
        {cancelLabel}
      </button>
      <button className={styles["continue-button"]} onClick={onContinue}>
        {continueLabel}
      </button>
    </div>
  );
};

export default FormButtons;