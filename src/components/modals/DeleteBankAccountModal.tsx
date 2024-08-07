import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import { revokeBankConnection } from "../middleware/Api";
import useCachedImages from "../utils/images";

interface DeleteBankAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  userId: string | null;
  token: string | null;
  bankAccountId: number | null;
  onBankRevoked: () => void;
}

const DeleteBankAccountModal: React.FC<DeleteBankAccountModalProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  userId,
  token,
  bankAccountId,
  onBankRevoked,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const images = useCachedImages(["close"]);

  useEffect(() => {
    if (isOpen) {
      setModalIsOpen(true);
    } else {
      setTimeout(() => {
        setModalIsOpen(false);
      }, 300);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    try {
      if (userId && token && bankAccountId) {
        await revokeBankConnection(userId, token, bankAccountId);
        handleClose();
        onBankRevoked();
      }
    } catch (error) {
      console.error("Error revoking bank account:", error);
    }
  };

  const handleClose = () => {
    if (!isBlockingInteraction) {
      setModalIsOpen(false);
      onClose();
    }
  };

  if (!isOpen && !modalIsOpen) {
    return null;
  }

  return (
    <>
      <div
        className={`${styles.backdrop} ${modalIsOpen ? styles.open : ""}`}
        onClick={handleClose}
      ></div>
      <div className={`${styles.modal} ${modalIsOpen ? styles.open : ""}`}>
        <div className={styles.formTop}>
          <h2 className={styles.title}>Bank account verwijderen</h2>
          <button onClick={handleClose} className={styles.closeBtn}>
            <img src={images.close} alt="Close Icon" />
          </button>
        </div>
        <hr></hr>
        <p>
          Er staat een verwijdering van de bankkoppeling op het punt uitgevoerd
          te worden. Belangrijk: deze actie resulteert in de definitieve
          verwijdering van alle transacties die via deze bankrekening zijn
          verwerkt uit het systeem. Deze handeling is onomkeerbaar.
        </p>
        <div className={styles.buttonContainer}>
          <button onClick={handleClose} className={styles.cancelButton}>
            Annuleren
          </button>
          <button onClick={handleSubmit} className={styles.deleteButton}>
            Verwijderen
          </button>
        </div>
      </div>
    </>
  );
};

export default DeleteBankAccountModal;
