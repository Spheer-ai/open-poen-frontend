import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import { fetchPaymentDetails } from "../middleware/Api";

interface FetchPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  paymentId: number | null;
}

const FetchPayment: React.FC<FetchPaymentProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  paymentId,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      setModalIsOpen(true);
      const token = localStorage.getItem("token");
      if (token) {
        fetchPaymentDetails(paymentId, token)
          .then((data) => {
            setPaymentData(data);
          })
          .catch((error) => {
            console.error("Error fetching payment details:", error);
          });
      }
    } else {
      setTimeout(() => {
        setModalIsOpen(false);
      }, 300);
    }
  }, [isOpen, paymentId]);

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
        <h2 className={styles.title}>Transactie details</h2>
        <hr></hr>
        <div className={styles.formGroup}>
          <h3>Info</h3>
          <label className={styles.labelField}>Bedrag:</label>
          <span>{paymentData?.transaction_amount}</span>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelField}>Datum:</label>
          <span>{paymentData?.booking_date}</span>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelField}>Naam betaler:</label>
          <span>{paymentData?.debtor_name}</span>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelField}>Naam ontvanger:</label>
          <span>{paymentData?.short_user_description}</span>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelField}>Debtor Account:</label>
          <span>{paymentData?.debtor_account}</span>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelField}>Route:</label>
          <span>{paymentData?.route}</span>
        </div>
        <div className={styles.formGroup}>
          <h3>Attachments</h3>
          {paymentData?.attachments?.map((attachment: any) => (
            <div key={attachment.id}>
              <label>Attachment URL:</label>
              <span>{attachment.attachment_url}</span>
            </div>
          ))}
        </div>
        <div className={styles.buttonContainer}>
          <button onClick={handleClose} className={styles.cancelButton}>
            Sluiten
          </button>
        </div>
      </div>
    </>
  );
};

export default FetchPayment;
