import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../../assets/scss/layout/Step1BankList.module.scss";

interface Step3BankConfirmationProps {
  onClose: () => void;
}

const Step3BankConfirmation: React.FC<Step3BankConfirmationProps> = ({
  onClose,
}) => {
  const navigate = useNavigate();

  const handleBackToOverview = () => {
    onClose();
    navigate("/transactions/bankconnections/add-bank?step=3");
  };

  return (
    <>
      <div className={styles["confirmation-container"]}>
        <h3>Koppelen voltooid!</h3>
        <p>We hebben met succes verbinding gemaakt met jouw bank</p>
      </div>
      <div className={styles["button-container"]}>
        <button onClick={handleBackToOverview} className={styles.saveButton}>
          Terug naar het overzicht
        </button>
      </div>
    </>
  );
};

export default Step3BankConfirmation;
