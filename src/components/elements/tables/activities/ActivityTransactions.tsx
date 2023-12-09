import React, { useEffect, useState } from "react";
import { getPaymentsByActivity } from "../../../middleware/Api";
import styles from "../../../../assets/scss/TransactionOverview.module.scss";

interface Transaction {
  id: number;
  booking_date: string;
  activity_name: string;
  creditor_name: string;
  debtor_name: string;
  short_user_description: string;
  transaction_amount: number;
  n_attachments: number;
}

const ActivityTransactions: React.FC<{
  authToken: string;
  initiativeId: string;
  activityId: string;
}> = ({ authToken, initiativeId, activityId }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await getPaymentsByActivity(
          authToken,
          initiativeId,
          activityId,
        );

        if (response && response.payments) {
          setTransactions(response.payments);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [authToken, initiativeId, activityId]);

  return (
    <div className={styles.transactionOverview}>
      <table className={styles.transactionTable}>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityTransactions;
