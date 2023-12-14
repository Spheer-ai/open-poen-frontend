import React, { useEffect, useState } from "react";
import { getPaymentsByActivity } from "../../../middleware/Api";
import styles from "../../../../assets/scss/TransactionOverview.module.scss";
import PaymentDetails from "../../../modals/PaymentDetails";
import EditIcon from "/edit-icon.svg";
import ViewIcon from "/eye.svg";
import { useNavigate } from "react-router-dom";
import EditPayment from "../../../modals/EditPayment";
import AddPayment from "../../../modals/AddPayment";

interface Transaction {
  id: number;
  booking_date: string;
  activity_name: string;
  creditor_name: string;
  debtor_name: string;
  short_user_description: string;
  transaction_amount: number;
  n_attachments: number;
  transaction_id: number;
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("nl-NL", options);
};

const ActivityTransactions: React.FC<{
  authToken: string;
  initiativeId: string;
  activityId: string;
}> = ({ authToken, initiativeId, activityId }) => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    number | null
  >(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isBlockingInteraction, setIsBlockingInteraction] = useState(false);
  const [isFetchPaymentDetailsModalOpen, setIsFetchPaymentDetailsModalOpen] =
    useState(false);
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const [isEditPaymentModalOpen, setIsEditPaymentModalOpen] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await getPaymentsByActivity(
          authToken,
          initiativeId,
          activityId,
        );

        if (response && response.payments) {
          const formattedTransactions = response.payments.map(
            (transaction) => ({
              ...transaction,
              booking_date: formatDate(transaction.booking_date),
            }),
          );

          setTransactions(formattedTransactions);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [authToken, initiativeId, activityId, refreshTrigger]);

  const handleTransactionDetailsClick = (transactionId: number) => {
    setSelectedTransactionId(transactionId);

    console.log(`Selected Transaction ID: ${transactionId}`);

    setIsFetchPaymentDetailsModalOpen(true);
  };

  const handleTransactionEditClick = (transactionId: number) => {
    setSelectedTransactionId(transactionId);

    console.log(`Selected Transaction ID: ${transactionId}`);

    setIsEditPaymentModalOpen(true);
  };

  const handleToggleFetchPaymentDetailsModal = () => {
    if (isFetchPaymentDetailsModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsFetchPaymentDetailsModalOpen(false);
        navigate(`/funds/${initiativeId}/activities`);
      }, 300);
    } else {
      setIsFetchPaymentDetailsModalOpen(true);
      navigate(`/funds/${initiativeId}/activities/${initiativeId}/details`);
    }
  };

  const handleToggleEditPaymentModal = () => {
    if (isEditPaymentModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsEditPaymentModalOpen(false);
        navigate(`/funds/${initiativeId}/activities`);
      }, 300);
    } else {
      setIsEditPaymentModalOpen(true);
      navigate(
        `/funds/${initiativeId}/activities/${selectedTransactionId}/details`,
      );
    }
  };

  const handlePaymentEdited = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleToggleAddPaymentModal = () => {
    if (isAddPaymentModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsAddPaymentModalOpen(false);
        navigate(`/funds/${initiativeId}/activities/${activityId}`);
      }, 300);
    } else {
      setIsAddPaymentModalOpen(true);
      navigate(`/funds/${initiativeId}/activities/${activityId}/add-payment`);
    }
  };

  const handlePaymentAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <>
      {" "}
      <AddPayment
        isOpen={isAddPaymentModalOpen}
        onClose={handleToggleAddPaymentModal}
        isBlockingInteraction={isBlockingInteraction}
        onPaymentAdded={handlePaymentAdded}
        initiativeId={initiativeId}
        activityId={activityId}
      />
      <button
        className={styles["saveButton"]}
        onClick={handleToggleAddPaymentModal}
      >
        Transactie toevoegen
      </button>
      <div className={styles.fundTransactionOverview}>
        <table className={styles.fundTransactionTable}>
          <thead>
            <tr>
              <th>DATUM</th>
              <th>ACTIVITEIT BESCHRIJVING</th>
              <th>VERZENDER</th>
              <th>ONTVANGER</th>
              <th>MEDIA</th>
              <th>HOEVEELHEID</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.booking_date}</td>
                <td>{`${transaction.activity_name} ${transaction.short_user_description}`}</td>
                <td>{transaction.creditor_name}</td>
                <td>{transaction.debtor_name}</td>
                <td>{transaction.n_attachments}</td>
                <td>{transaction.transaction_amount}</td>
                <td>
                  <img
                    src={ViewIcon}
                    alt="View Icon"
                    onClick={() =>
                      handleTransactionDetailsClick(transaction.id)
                    }
                    style={{ cursor: "pointer", width: "24px", height: "24px" }}
                  />
                </td>
                <td>
                  <img
                    src={EditIcon}
                    alt="View Icon"
                    onClick={() => handleTransactionEditClick(transaction.id)}
                    style={{ cursor: "pointer" }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <PaymentDetails
          isOpen={isFetchPaymentDetailsModalOpen}
          onClose={handleToggleFetchPaymentDetailsModal}
          isBlockingInteraction={isBlockingInteraction}
          paymentId={selectedTransactionId}
        />
        <EditPayment
          isOpen={isEditPaymentModalOpen}
          onClose={handleToggleEditPaymentModal}
          isBlockingInteraction={isBlockingInteraction}
          paymentId={selectedTransactionId}
          onPaymentEdited={handlePaymentEdited}
          paymentData={""}
        />
      </div>
    </>
  );
};

export default ActivityTransactions;
