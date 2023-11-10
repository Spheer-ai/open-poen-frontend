import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import Step1InviteUsers from "./steps-modal/invite-bank-users/Step1InviteUsers";
import Step2Confirmation from "./steps-modal/invite-bank-users/Step2Confirmation";
import { useLocation } from "react-router-dom";
import { fetchUsersEmails } from "../middleware/Api";

type InviteBankUsersModalProps = {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  bankAccountId: number | null;
  userId: number;
  token: string;
};

const InviteBankUsersModal: React.FC<InviteBankUsersModalProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  bankAccountId,
  userId,
  token,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const [userEmails, setUserEmails] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setCurrentStep(1);

      fetchUserEmails();
    } else {
      setIsVisible(false);
      setCurrentStep(1);
    }
  }, [isOpen]);

  const fetchUserEmails = async () => {
    try {
      const emails = await fetchUsersEmails(userId, token, bankAccountId);
      setUserEmails(emails);
    } catch (error) {}
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const stepParam = searchParams.get("step");
    console.log("stepParam:", stepParam);

    if (stepParam === "2") {
      setTimeout(() => {
        setCurrentStep(2);
      }, 0);
    } else if (
      location.pathname === "/transactions/bankaccounts/invite-users"
    ) {
      setCurrentStep(1);
    }
    console.log("currentStep:", currentStep);
  }, [location.search, location.pathname]);

  const handleNextStep = () => {
    if (currentStep < 2) {
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

  console.log("isOpen:", isOpen);

  const modalClasses = `${styles.modal} ${isVisible ? styles.open : ""}`;

  return (
    <div className={styles.modalWrapper}>
      <div className={modalClasses}>
        <div className={styles.modalBody}>
          {currentStep === 1 && (
            <>
              <div className={styles["modal-top-section"]}>
                <h2 className={styles.title}>Invite Bank Users</h2>
              </div>
              <Step1InviteUsers
                onNextStep={handleNextStep}
                bankAccountId={bankAccountId}
                userId={userId}
                token={token}
              />
            </>
          )}
          {currentStep === 2 && (
            <>
              <div className={styles["modal-top-section"]}>
                <h2 className={styles.title}>Invite Bank Users</h2>
              </div>
              <Step2Confirmation
                onClose={handleClose}
                bankAccountId={bankAccountId}
              />
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

export default InviteBankUsersModal;
