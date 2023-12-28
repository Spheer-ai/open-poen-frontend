import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import LoadingDot from "../animation/LoadingDot";
import { editPayment, uploadPaymentAttachment } from "../middleware/Api";

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

interface EditPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onPaymentEdited: () => void;
  paymentId: number | null;
  paymentData: Transaction | null;
  token: string | null;
}

const EditPayment: React.FC<EditPaymentProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  onPaymentEdited,
  paymentId,
  paymentData,
  token,
}) => {
  console.log("Token prop received in EditPayment:", token);
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const [displayDate, setDisplayDate] = useState("");
  const [apiDate, setApiDate] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [transactionData, setTransactionData] = useState({
    transaction_amount: 0,
    booking_date: "",
    creditor_name: "",
    debtor_name: "",
    creditor_account: "",
    debtor_account: "",
    route: "inkomen",
    short_user_description: "",
    long_user_description: "",
    hidden: true,
  });

  useEffect(() => {
    console.log("Payment data received in EditPayment:", paymentData);
  }, [paymentData]);

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
        creditor_account: paymentData.creditor_account,
        debtor_account: paymentData.debtor_account,
        route: paymentData.route || "inkomen",
        short_user_description: paymentData.short_user_description,
        long_user_description: paymentData.long_user_description,
        hidden: paymentData.hidden || true,
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

  const handleResetState = () => {
    setSelectedFile(null);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      if (!token) {
        console.error("Token is not available.");
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

      if (selectedFile) {
        await uploadPaymentAttachment(paymentId, selectedFile, token);
      }

      await editPayment(paymentId, requestData, token);

      onPaymentEdited();
      handleResetState();
      resetState();
      setIsLoading(false);
      handleClose();
    } catch (error) {
      console.error("Error editing payment:", error);
    }
  };

  const resetState = () => {
    setTransactionData({
      transaction_amount: 0,
      booking_date: "",
      creditor_name: "",
      debtor_name: "",
      creditor_account: "",
      debtor_account: "",
      route: "inkomen",
      short_user_description: "",
      long_user_description: "",
      hidden: true,
    });
    setDisplayDate("");
    setApiDate("");
    setSelectedFile(null);
    setIsLoading(false);
  };

  const handleClose = () => {
    if (!isBlockingInteraction) {
      resetState();
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

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleCancelImage = () => {
    setSelectedFile(null);
  };

  return (
    <>
      <div
        className={`${styles.backdrop} ${modalIsOpen ? styles.open : ""}`}
        onClick={handleClose}
      ></div>

      <div className={`${styles.modal} ${modalIsOpen ? styles.open : ""}`}>
        <h2 className={styles.title}>Transacties bewerken</h2>
        <hr></hr>
        {isLoading && (
          <div className={styles["loading-container"]}>
            <LoadingDot delay={0} />
            <LoadingDot delay={0.1} />
            <LoadingDot delay={0.1} />
            <LoadingDot delay={0.2} />
            <LoadingDot delay={0.2} />
          </div>
        )}
        {!isLoading ? (
          <>
            <div className={`${styles.formGroup}`}>
              {selectedFile && (
                <div className={styles.imagePreview}>
                  <div className={styles.imageContainer}>
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Image Preview"
                      className={styles.previewImage}
                      style={{ maxHeight: "150px", borderRadius: "8px" }}
                    />
                    <button
                      className={styles.closeButton}
                      onClick={handleCancelImage}
                    >
                      <img src="/close-preview.svg" alt="Close" />
                    </button>
                  </div>
                </div>
              )}
              {!selectedFile && (
                <>
                  <label className={styles.labelField}>Media:</label>
                  <label htmlFor="fileInput" className={styles.customFileInput}>
                    <div>
                      {" "}
                      <img src="/upload-image.svg" alt="Upload Image" />
                    </div>
                    <span>
                      Sleep en zet neer of blader om een bestand te uploaden
                    </span>
                    <input
                      type="file"
                      id="fileInput"
                      accept=".pdf, .jpg, .png"
                      onChange={handleFileChange}
                      className={styles.hiddenFileInput}
                    />
                  </label>
                </>
              )}
            </div>
            <div className={styles.formGroup}>
              <h3>Info</h3>
              <label className={styles.labelField}>Bedrag:</label>
              <input
                type="number"
                value={transactionData.transaction_amount.toString()}
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
            <div className={styles.formGroup}>
              <label className={styles.labelField}>Betaal IBAN</label>
              <input
                type="text"
                value={transactionData.debtor_account}
                onChange={(e) =>
                  setTransactionData({
                    ...transactionData,
                    debtor_account: e.target.value,
                  })
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.labelField}>Naam ontvanger:</label>
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
              <label className={styles.labelField}>Ontvanger IBAN</label>
              <input
                type="text"
                value={transactionData.creditor_account}
                onChange={(e) =>
                  setTransactionData({
                    ...transactionData,
                    creditor_account: e.target.value,
                  })
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.labelField}>Route:</label>
              <select
                value={transactionData.route}
                onChange={(e) =>
                  setTransactionData({
                    ...transactionData,
                    route: e.target.value,
                  })
                }
              >
                <option value="inkomen">Inkomen</option>
                <option value="uitgaven">Uitgaven</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.labelField}>Korte beschrijving</label>
              <input
                type="text"
                value={transactionData.short_user_description}
                onChange={(e) =>
                  setTransactionData({
                    ...transactionData,
                    short_user_description: e.target.value,
                  })
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.labelField}>lange beschrijving</label>
              <input
                type="text"
                value={transactionData.long_user_description}
                onChange={(e) =>
                  setTransactionData({
                    ...transactionData,
                    long_user_description: e.target.value,
                  })
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.labelField}>
                <input
                  type="checkbox"
                  checked={transactionData.hidden}
                  onChange={(e) =>
                    setTransactionData({
                      ...transactionData,
                      hidden: e.target.checked,
                    })
                  }
                />
                Hidden:
              </label>
            </div>
          </>
        ) : null}
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
