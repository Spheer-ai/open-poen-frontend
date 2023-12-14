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
  const [displayDate, setDisplayDate] = useState("");
  const [apiDate, setApiDate] = useState("");

  const [transactionData, setTransactionData] = useState({
    transaction_amount: 0,
    booking_date: "",
    creditor_name: "",
    debtor_name: "",
  });

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
        transaction_amount: parseFloat(paymentData.transaction_amount),
        booking_date: paymentData.booking_date,
        creditor_name: paymentData.creditor_name,
        debtor_name: paymentData.debtor_name,
      });

      setDisplayDate(formatDateForInput(new Date(paymentData.booking_date)));
      setApiDate(paymentData.booking_date);
    }
  }, [paymentData]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    console.log("New Date Value:", newDate);

    setDisplayDate(newDate);

    setTransactionData({
      ...transactionData,
      booking_date: newDate,
    });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is not available in localStorage");
        return;
      }

      console.log("Received paymentId:", paymentId);
      const displayDateObject = new Date(displayDate);

      if (isNaN(displayDateObject.getTime())) {
        console.error("Invalid date format");
        return;
      }

      const apiDate = displayDateObject.toISOString();

      const requestData = {
        ...transactionData,
        booking_date: apiDate,
        transaction_id: paymentId,
      };

      console.log("Data to be sent to API:", requestData);

      await editPayment(paymentId, requestData, token);

      onPaymentEdited();

      handleClose();
    } catch (error) {
      console.error("Error editing payment:", error);
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

  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
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
                transaction_amount: parseFloat(e.target.value),
              })
            }
            onKeyDown={handleEnterKeyPress}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelField}>Datum:</label>
          <input
            type="date"
            value={displayDate}
            onChange={handleDateChange}
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
