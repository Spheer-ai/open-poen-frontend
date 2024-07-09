import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../../../assets/scss/layout/Step1BankList.module.scss";
import useCachedImages from "../../../utils/images";

interface Step3BankConfirmationProps {
  onClose: () => void;
  message: string;
}

const Step3BankConfirmation: React.FC<Step3BankConfirmationProps> = ({
  onClose,
  message,
}) => {
  const navigate = useNavigate();
  const images = useCachedImages(["succes"]);

  const handleBackToOverview = () => {
    onClose();

    const callbackUrl = `/transactions/bankconnections/add-bank?step=3&message=${message}`;
    navigate(callbackUrl);
  };

  let title, description, iconSrc;

  if (message === "success") {
    title = "Koppelen voltooid!";
    description = "We hebben met succes verbinding gemaakt met jouw bank.";
    iconSrc = `${images.succes}`;
  } else if (message === "third-party-error") {
    title = "Fout bij Externe Dienst";
    description =
      "Er is een probleem opgetreden tijdens de communicatie met een externe dienst.";
  } else if (message === "jwt-token-expired") {
    title = "Aanmelding Verlopen";
    description = "Je aanmelding is verlopen tijdens het proces.";
  } else if (message === "jwt-validation-error") {
    title = "Fout bij Aanmelding";
    description =
      "Er is een probleem opgetreden bij het valideren van je aanmelding.";
  } else if (message === "user-404") {
    title = "Gebruiker Niet Gevonden";
    description = "We konden de gebruiker niet vinden tijdens het proces.";
  } else if (message === "requisition-404") {
    title = "Aanvraag Niet Gevonden";
    description = "We konden de gevraagde informatie niet vinden.";
  } else {
    title = "Onbekende foutmelding";
    description =
      "Er is een obekende foutmelding opgetreden. Er is geen bank account toegevoegd. Probeer het opniew";
  }

  return (
    <>
      <div className={styles["confirmation-container"]}>
        <div className={styles["confirmation-content"]}>
          <h3>{title}</h3>
          <p>{description}</p>
          {iconSrc && (
            <img className={styles["success-icon"]} src={iconSrc} alt="" />
          )}
        </div>
        {message === "success" && (
          <p>We hebben 100% van jouw transacties gecategoriseerd.</p>
        )}
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
