import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import Step1BankList from "../modals/steps-modal/Step1Banklist";

interface AddBankConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
}

const AddBankConnectionModal: React.FC<AddBankConnectionModalProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setCurrentStep(1);
    } else {
      setIsVisible(false);
      setCurrentStep(1);
    }
  }, [isOpen]);

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
      onClose();
    }
  };

  const modalClasses = `${styles.modal} ${isVisible ? styles.open : ""}`;

  return (
    <div className={styles.modalWrapper}>
      <div className={modalClasses}>
        <div className={styles.modalContent}>
          {currentStep > 1 && (
            <button onClick={handlePrevStep} className={styles.prevButton}>
              Previous
            </button>
          )}
          {currentStep < 3 && (
            <button onClick={handleNextStep} className={styles.nextButton}>
              Next
            </button>
          )}
          {currentStep === 3 && (
            <button onClick={handleClose} className={styles.cancelButton}>
              Close
            </button>
          )}
        </div>
        <div className={styles.modalBody}>
          {currentStep === 1 && (
            <>
              <Step1BankList onNextStep={handleNextStep} />
            </>
          )}
          {currentStep === 2 && (
            <>
              <h2 className={styles.title}>Step 2: Confirming Connection</h2>
              {/* Add content for the second step here */}
            </>
          )}
          {currentStep === 3 && (
            <>
              <h2 className={styles.title}>Step 3: Confirmation</h2>
              {/* Add content for the last step here */}
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
