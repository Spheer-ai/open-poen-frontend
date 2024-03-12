import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import { fetchPaymentDetails } from "../middleware/Api";
import format from "date-fns/format";
import nlLocale from "date-fns/locale/nl";
import CloseIson from "/close-icon.svg";

export interface Transaction {
  id: number;
  booking_date: string;
  activity_name: string;
  creditor_name: string;
  debtor_name: string;
  n_attachments: number;
  transaction_amount: number;
  transaction_id: number;
  creditor_account: string;
  debtor_account: string;
  route: string;
  short_user_description: string;
  long_user_description: string;
  hidden: boolean;
}

interface FetchPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  paymentId: number | null;
  paymentData: Transaction | null;
}

const FetchPayment: React.FC<FetchPaymentProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  paymentId,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const [paymentData, setPaymentData] = useState<Transaction>();

  useEffect(() => {
    if (isOpen) {
      setModalIsOpen(true);

      fetchPaymentDetails(paymentId)
        .then((data) => {
          setPaymentData(data);
        })
        .catch((error) => {
          console.error("Error fetching payment details:", error);
        });
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
        <div className={styles.formTop}>
          <h2 className={styles.title}>Transactie details</h2>
          <button onClick={handleClose} className={styles.closeBtn}>
            <img src={CloseIson} alt="" />
          </button>
        </div>
        <hr></hr>
        <div className={`${styles.formGroup} ${styles.flexed}`}>
          <h3>Info</h3>
          <label className={styles.labelField}>Bedrag:</label>
          {paymentData?.transaction_amount ? (
            <span>
              €{" "}
              {paymentData.transaction_amount.toLocaleString("nl-NL", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          ) : (
            <span className={styles.cursiveText}>Geen gegevens bekend</span>
          )}
        </div>
        <hr></hr>
        <div className={`${styles.formGroup} ${styles.flexed}`}>
          <label className={styles.labelField}>Datum:</label>
          {paymentData?.booking_date ? (
            <span>
              {format(new Date(paymentData.booking_date), "dd-MM-yyyy", {
                locale: nlLocale,
              })}
            </span>
          ) : (
            <span className={styles.cursiveText}>Geen gegevens bekend</span>
          )}
        </div>
        <hr></hr>
        <div className={`${styles.formGroup} ${styles.flexed}`}>
          <label className={styles.labelField}>Naam betaler:</label>
          {paymentData?.debtor_name ? (
            <span>{paymentData.debtor_name}</span>
          ) : (
            <span className={styles.cursiveText}>Geen gegevens bekend</span>
          )}
        </div>
        <hr></hr>
        <div className={`${styles.formGroup} ${styles.flexed}`}>
          <label className={styles.labelField}>Korte beschrijving:</label>
          {paymentData?.short_user_description ? (
            <span>{paymentData.short_user_description}</span>
          ) : (
            <span className={styles.cursiveText}>Geen gegevens bekend</span>
          )}
        </div>
        <hr></hr>
        <div className={`${styles.formGroup} ${styles.flexed}`}>
          <label className={styles.labelField}>Betaal IBAN:</label>
          {paymentData?.debtor_account ? (
            <span>{paymentData.debtor_account}</span>
          ) : (
            <span className={styles.cursiveText}>Geen gegevens bekend</span>
          )}
        </div>
        <hr></hr>
        <div className={`${styles.formGroup} ${styles.flexed}`}>
          <label className={styles.labelField}>Route:</label>
          {paymentData?.route ? (
            <span>{paymentData.route}</span>
          ) : (
            <span className={styles.cursiveText}>Geen gegevens bekend</span>
          )}
        </div>
        <hr></hr>
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
