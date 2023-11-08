import React from "react";
import styles from "../../../../assets/scss/layout/AddFundDesktop.module.scss";

interface Step2ConfirmationProps {
  onClose: () => void;
  bankAccountId: number;
}

const Step2Confirmation: React.FC<Step2ConfirmationProps> = ({
  onClose,
  bankAccountId,
}) => {
  const sendInvitations = async () => {
    try {
      onClose();
    } catch (error) {
      console.error("Error sending invitations:", error);
    }
  };

  return (
    <div className={styles.step2}>
      <h3>Step 2: Confirmation</h3>
      <p>Please review the information below before confirming:</p>
      <ul>
        <li>Bank Account ID: {bankAccountId}</li>
      </ul>
      <button onClick={sendInvitations}>Confirm</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default Step2Confirmation;
