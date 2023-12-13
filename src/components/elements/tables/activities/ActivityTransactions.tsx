import React, { useEffect, useState } from "react";
import { getPaymentsByActivity } from "../../../middleware/Api";
import styles from "../../../../assets/scss/TransactionOverview.module.scss";
import PaymentDetails from "../../../modals/PaymentDetails";
import { useNavigate } from "react-router-dom";

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
  const [isBlockingInteraction, setIsBlockingInteraction] = useState(false);
  const [isFetchPaymentDetailsModalOpen, setIsFetchPaymentDetailsModalOpen] =
    useState(false);

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
  }, [authToken, initiativeId, activityId]);

  const handleTransactionClick = (transactionId: number) => {
    setSelectedTransactionId(transactionId);

    console.log(`Selected Transaction ID: ${transactionId}`);
    setIsFetchPaymentDetailsModalOpen(true);
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

  return (
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
            <tr
              key={index}
              onClick={() => handleTransactionClick(transaction.id)}
            >
              <td>{transaction.booking_date}</td>
              <td>{`${transaction.activity_name} ${transaction.short_user_description}`}</td>
              <td>{transaction.creditor_name}</td>
              <td>{transaction.debtor_name}</td>
              <td>{transaction.n_attachments}</td>
              <td>{transaction.transaction_amount}</td>
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
    </div>
  );
};

export default ActivityTransactions;
