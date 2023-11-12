import React from "react";
import styles from "../../../../assets/scss/layout/AddFundDesktop.module.scss";

interface Step2DeleteConfirmationProps {
  onClose: () => void;
}

const Step2DeleteConfirmation: React.FC<Step2DeleteConfirmationProps> = ({
  onClose,
}) => {
  return (
    <div className={styles.step2}>
      <div>
        <h3 style={{ margin: "0", padding: "0" }}>
          Bank Account Deleted Successfully.
        </h3>
        <p>
          The bank account has been successfully deleted. You no longer have
          access to this bank account.
        </p>
      </div>
      <button className={styles.saveButton} onClick={onClose}>
        Back to Overview
      </button>
    </div>
  );
};

export default Step2DeleteConfirmation;
