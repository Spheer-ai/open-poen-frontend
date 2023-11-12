import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import { useLocation } from "react-router-dom";
import Step1DeleteBankAccount from "./steps-modal/delete-bankaccount/Step1DeleteBankAccount";
import Step2DeleteBankConfirmation from "./steps-modal/delete-bankaccount/Step2DeleteConfirmation";
import { deleteBankAccount } from "../middleware/Api";

interface DeleteBankAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  userId: string | null;
  token: string | null;
  bankAccountId: number | null;
}

const DeleteBankAccountModal: React.FC<DeleteBankAccountModalProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  userId,
  token,
  bankAccountId,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
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

  const handleClose = () => {
    if (!isBlockingInteraction) {
      setIsVisible(false);
      setCurrentStep(1);
      onClose();
    }
  };

  const redirectToStep2 = () => {
    setCurrentStep(2);
  };

  const handleDeleteBankAccount = async () => {
    if (userId && token && bankAccountId) {
      try {
        await deleteBankAccount(userId, token, bankAccountId);
        redirectToStep2();
      } catch (error) {
        console.error("Error deleting bank account:", error);
      }
    }
  };

  const modalClasses = `${styles.modal} ${isVisible ? styles.open : ""}`;

  return (
    <div className={styles.modalWrapper}>
      <div className={modalClasses}>
        <div className={styles.modalBody}>
          {currentStep === 1 && (
            <>
              <div className={styles["modal-top-section"]}>
                <h2 className={styles.title}>Delete Bank Account</h2>
              </div>
              <Step1DeleteBankAccount
                userId={userId}
                token={token}
                bankAccountId={bankAccountId}
                onDelete={redirectToStep2}
              />
            </>
          )}
          {currentStep === 2 && (
            <>
              <div className={styles["modal-top-section"]}>
                <h2 className={styles.title}>Delete Bank Account</h2>
              </div>
              <Step2DeleteBankConfirmation onClose={handleClose} />
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

export default DeleteBankAccountModal;
