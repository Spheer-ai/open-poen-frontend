import React from "react";
import styles from "../../../../assets/scss/layout/AddFundDesktop.module.scss";

interface Step2ConfirmationProps {
  onClose: () => void;
  bankAccountId: number | null;
}

const Step2Confirmation: React.FC<Step2ConfirmationProps> = ({ onClose }) => {
  return (
    <div className={styles.step2}>
      <div>
        <h3 style={{ margin: "0", padding: "0" }}>
          Toegang succesvol bijgewerkt.
        </h3>
        <p>
          De toegangsstatus van personen is bijgewerkt. Het is belangrijk op te
          merken dat toegang tot het bankrekeningnummer op elk gewenst moment
          kan worden ingetrokken of gewijzigd door de eigenaar.
        </p>
      </div>
      <button className={styles.saveButton} onClick={onClose}>
        Terug naar het overzicht
      </button>
    </div>
  );
};

export default Step2Confirmation;
