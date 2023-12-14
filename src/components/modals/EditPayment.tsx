import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import { editPayment } from "../middleware/Api";

interface EditPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onPaymentEdited: () => void;
  paymentId: number | null;
  paymentData: any;
}

const EditPayment: React.FC<EditPaymentProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  onPaymentEdited,
  paymentId,
  paymentData,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const [transactionData, setTransactionData] = useState(
    paymentData || {
      transaction_amount: 0,
      booking_date: "",
      creditor_name: "",
      debtor_name: "",
    },
  );

  useEffect(() => {
    if (isOpen) {
      setModalIsOpen(true);
    } else {
      setTimeout(() => {
        setModalIsOpen(false);
      }, 300);
    }
  }, [isOpen]);

  useEffect(() => {
    if (paymentData) {
      setTransactionData({
        transaction_amount: paymentData.transaction_amount,
        booking_date: paymentData.booking_date,
        creditor_name: paymentData.creditor_name,
        debtor_name: paymentData.debtor_name,
      });
    }
  }, [paymentData]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is not available in localStorage");
        return;
      }

      await editPayment(paymentId, transactionData, token);

      onPaymentEdited();

      handleClose();
    } catch (error) {
      console.error("Error creating payment:", error);
    }
  };

  const handleClose = () => {
    if (!isBlockingInteraction) {
      setModalIsOpen(false);
      onClose();
    }
  };

  const handleEnterKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  if (!isOpen && !modalIsOpen) {
    return null;
  }
  const formatDateForInput = (date: Date) => {
    if (date instanceof Date && !isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = `${date.getMonth() + 1}`.padStart(2, "0");
      const day = `${date.getDate()}`.padStart(2, "0");
      return `${year}-${month}-${day}`;
    } else {
      return "";
    }
  };

  return (
    <>
      <div
        className={`${styles.backdrop} ${modalIsOpen ? styles.open : ""}`}
        onClick={handleClose}
      ></div>
      <div className={`${styles.modal} ${modalIsOpen ? styles.open : ""}`}>
        <h2 className={styles.title}>Transacties aanmaken</h2>
        <hr></hr>
        <div className={styles.formGroup}>
          <h3>Info</h3>
          <label className={styles.labelField}>Bedrag:</label>
          <input
            type="number"
            value={transactionData.transaction_amount}
            onChange={(e) =>
              setTransactionData({
                ...transactionData,
                transaction_amount: e.target.value,
              })
            }
            onKeyDown={handleEnterKeyPress}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelField}>Datum:</label>
          <input
            type="date"
            value={formatDateForInput(paymentData.booking_date)}
            onChange={(e) =>
              setTransactionData({
                ...paymentData,
                booking_date: new Date(e.target.value),
              })
            }
            onKeyDown={handleEnterKeyPress}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelField}>Naam betaler:</label>
          <input
            type="text"
            value={transactionData.creditor_name}
            onChange={(e) =>
              setTransactionData({
                ...transactionData,
                creditor_name: e.target.value,
              })
            }
            onKeyDown={handleEnterKeyPress}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelField}>Naam ontvanger:</label>
          <input
            type="text"
            value={transactionData.debtor_name}
            onChange={(e) =>
              setTransactionData({
                ...transactionData,
                debtor_name: e.target.value,
              })
            }
            onKeyDown={handleEnterKeyPress}
          />
        </div>
        <div className={styles.buttonContainer}>
          <button onClick={handleClose} className={styles.cancelButton}>
            Annuleren
          </button>
          <button onClick={handleSave} className={styles.saveButton}>
            Opslaan
          </button>
        </div>
      </div>
    </>
  );
};

export default EditPayment;
