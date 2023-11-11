import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import Step1BankList from "./steps-modal/bankconnection/Step1BankList";
import Step2BankApproval from "./steps-modal/bankconnection/Step2BankApproval";
import Step3BankConfirmation from "./steps-modal/bankconnection/Step3BankConfirmation";
import { useLocation } from "react-router-dom";

interface AddBankConnectionModalProps {
  isOpen: boolean;
  onClose: (title: string) => void;
  isBlockingInteraction: boolean;
  isReconnecting?: boolean;
  title: string;
}

const AddBankConnectionModal: React.FC<AddBankConnectionModalProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  isReconnecting,
  title,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setCurrentStep(1);
    } else {
      setIsVisible(false);
      setCurrentStep(1);
    }
  }, [isOpen]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const stepParam = searchParams.get("step");

    if (stepParam === "3") {
      setTimeout(() => {
        setCurrentStep(3);
      }, 0);
    } else if (location.pathname === "/transactions/bankaccounts/add-bank") {
      setCurrentStep(isReconnecting ? 2 : 1);
    }
  }, [location.search, location.pathname, isReconnecting]);

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    if (!isBlockingInteraction) {
      setIsVisible(false);
      setCurrentStep(1);
      onClose(title);
    }
  };

  const handleSelectBank = (institutionId: string) => {
    setSelectedBank(institutionId);
    setCurrentStep(2);
  };

  const modalClasses = `${styles.modal} ${isVisible ? styles.open : ""}`;

  return (
    <div className={styles.modalWrapper}>
      <div className={modalClasses}>
        <div className={styles.modalBody}>
          {currentStep === 1 && (
            <>
              <div className={styles["modal-top-section"]}>
                <h2 className={styles.title}>{title}</h2>
              </div>
              <Step1BankList
                onNextStep={handleNextStep}
                onSelectBank={handleSelectBank}
              />
            </>
          )}
          {currentStep === 2 && selectedBank && (
            <>
              <div className={styles["modal-top-section"]}>
                <h2 className={styles.title}>{title}</h2>
              </div>
              <Step2BankApproval institutionId={selectedBank} />
            </>
          )}
          {currentStep === 3 && (
            <>
              <div className={styles["modal-top-section"]}>
                <h2 className={styles.title}></h2>
              </div>
              <Step3BankConfirmation onClose={handleClose} />
            </>
          )}
        </div>
      </div>
      <div
        className={`${styles.backdrop} ${isVisible ? styles.open : ""}`}
        onClick={handleClose}
      ></div>
    </div>
  );
};

export default AddBankConnectionModal;
