import React from "react";
import styles from "../../../../assets/scss/layout/Step1BankList.module.scss";

interface Step2DeleteConfirmationProps {
  onClose: () => void;
}

const Step2DeleteConfirmation: React.FC<Step2DeleteConfirmationProps> = ({
  onClose,
}) => {
  return (
    <div className={styles.step2}>
      <div>
        <h3 style={{ padding: "0" }}>Verwijderen voltooid.</h3>
        <p>
          De verwijdering van de bankrekening is succesvol voltooid. Alle
          transacties die via deze rekening werden uitgevoerd, zijn nu permanent
          uit ons systeem verwijderd.
        </p>
      </div>
      <div className={styles["button-container"]}>
        <button className={styles.saveButton} onClick={onClose}>
          Ga terug naar het overizcht
        </button>
      </div>
    </div>
  );
};

export default Step2DeleteConfirmation;
