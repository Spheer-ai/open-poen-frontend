import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import Select from "react-select";
import { createPayment } from "../middleware/Api";

interface AddPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onPaymentAdded: () => void;
  initiativeId: string;
  activityId: string | null;
}

const AddPayment: React.FC<AddPaymentProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  onPaymentAdded,
  initiativeId,
  activityId,
}) => {
  const initialPaymentData = {
    booking_date: new Date(),
    transaction_amount: "",
    creditor_name: "",
    creditor_account: "",
    debtor_name: "",
    debtor_account: "",
    route: "inkomen",
    short_user_description: "",
    long_user_description: "",
    hidden: false,
    type: "handmatig",
    initiative_id: Number(initiativeId),
    activity_id: activityId ? Number(activityId) : null,
  };
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const [paymentData, setPaymentData] = useState(initialPaymentData);
  const routeOptions = [
    { value: "inkomen", label: "Inkomen" },
    { value: "uitgaven", label: "Uitgaven" },
  ];

  useEffect(() => {
    if (isOpen) {
      setModalIsOpen(true);
    } else {
      setTimeout(() => {
        setModalIsOpen(false);
      }, 300);
    }
  }, [isOpen]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is not available in localStorage");
        return;
      }

      const formattedDate = paymentData.booking_date.toISOString();

      const dataToSend = {
        ...paymentData,
        booking_date: formattedDate,
      };

      await createPayment(dataToSend, token);

      onPaymentAdded();

      handleClose();
      setPaymentData(initialPaymentData);
    } catch (error) {
      console.error("Error creating payment:", error);
    }
  };

  const handleClose = () => {
    if (!isBlockingInteraction) {
      setModalIsOpen(false);
      onClose();
      setPaymentData(initialPaymentData);
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

  const formatDateForInput = (date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
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
            type="text"
            value={paymentData.transaction_amount}
            onChange={(e) => {
              const userInput = e.target.value;
              const formattedValue = userInput.replace(",", ".");

              setPaymentData({
                ...paymentData,
                transaction_amount: formattedValue,
              });
            }}
            onKeyDown={(e) => {
              if (
                e.key === "-" &&
                !paymentData.transaction_amount.includes("-")
              ) {
                setPaymentData({
                  ...paymentData,
                  route: "uitgaven",
                });
              } else if (!paymentData.transaction_amount.startsWith("-")) {
                setPaymentData({
                  ...paymentData,
                  route: "inkomen",
                });
              }
            }}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelField}>Datum:</label>
          <input
            type="date"
            value={formatDateForInput(paymentData.booking_date)}
            onChange={(e) =>
              setPaymentData({
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
            value={paymentData.debtor_name}
            onChange={(e) =>
              setPaymentData({
                ...paymentData,
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
            value={paymentData.debtor_account}
            onChange={(e) =>
              setPaymentData({
                ...paymentData,
                debtor_account: e.target.value,
              })
            }
            onKeyDown={handleEnterKeyPress}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelField}>Naam ontvanger:</label>
          <input
            type="text"
            value={paymentData.creditor_name}
            onChange={(e) =>
              setPaymentData({
                ...paymentData,
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
            value={paymentData.creditor_account}
            onChange={(e) =>
              setPaymentData({
                ...paymentData,
                creditor_account: e.target.value,
              })
            }
            onKeyDown={handleEnterKeyPress}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelField}>Route:</label>
          <div style={{ marginTop: "10px" }}>
            <Select
              options={routeOptions}
              value={routeOptions.find(
                (option) => option.value === paymentData.route,
              )}
              onChange={(selectedOption) =>
                setPaymentData({
                  ...paymentData,
                  route: selectedOption?.value || "",
                })
              }
            />
          </div>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelField}>Korte beschrijving</label>
          <input
            type="text"
            value={paymentData.short_user_description}
            onChange={(e) =>
              setPaymentData({
                ...paymentData,
                short_user_description: e.target.value,
              })
            }
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelField}>lange beschrijving</label>
          <input
            type="text"
            value={paymentData.long_user_description}
            onChange={(e) =>
              setPaymentData({
                ...paymentData,
                long_user_description: e.target.value,
              })
            }
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

export default AddPayment;
