import React, { useEffect, useState } from "react";
import { getPaymentsByInitiative } from "../../../middleware/Api";
import styles from "../../../../assets/scss/TransactionOverview.module.scss";
import PaymentDetails from "../../../modals/PaymentDetails";
import EditIcon from "/edit-icon.svg";
import ViewIcon from "/eye.svg";
import { useNavigate } from "react-router-dom";
import EditPayment from "../../../modals/EditPayment";

interface Transaction {
  id: number;
  booking_date: string;
  activity_name: string;
  creditor_name: string;
  debtor_name: string;
  n_attachments: number;
  transaction_amount: number;
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

const FundsTransactions: React.FC<{
  authToken: string;
  initiativeId: string;
}> = ({ authToken, initiativeId }) => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    number | null
  >(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isBlockingInteraction, setIsBlockingInteraction] = useState(false);
  const [isFetchPaymentDetailsModalOpen, setIsFetchPaymentDetailsModalOpen] =
    useState(false);
  const [isEditPaymentModalOpen, setIsEditPaymentModalOpen] = useState(false);
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await getPaymentsByInitiative(authToken, initiativeId);

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
  }, [authToken, initiativeId, refreshTrigger]);

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

  return (
    <div className={styles.fundTransactionOverview}>
      <table className={styles.fundTransactionTable}>
        <thead>
          <tr>
            <th>Datum</th>
            <th>Activiteit</th>
            <th>Verzender</th>
            <th>Ontvanger</th>
            <th>Media</th>
            <th>Hoeveelheid</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.booking_date}</td>
              <td>{transaction.activity_name}</td>
              <td>{transaction.creditor_name}</td>
              <td>{transaction.debtor_name}</td>
              <td>{transaction.n_attachments}</td>
              <td>{transaction.transaction_amount}</td>
              <td>{transaction.transaction_id}</td>
              <td>
                <img
                  src={ViewIcon}
                  alt="View Icon"
                  onClick={() => handleTransactionDetailsClick(transaction.id)}
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
  );
};

export default FundsTransactions;
