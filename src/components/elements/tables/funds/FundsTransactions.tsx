import React, { useEffect, useState } from "react";
import { getPaymentsByInitiative } from "../../../middleware/Api";
import styles from "../../../../assets/scss/TransactionOverview.module.scss";

interface Transaction {
  id: number;
  booking_date: string;
  activity_name: string;
  creditor_name: string;
  debtor_name: string;
  n_attachments: number;
  transaction_amount: number;
}

const FundsTransactions: React.FC<{
  authToken: string;
  initiativeId: string;
}> = ({ authToken, initiativeId }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await getPaymentsByInitiative(authToken, initiativeId);

        if (response && response.payments) {
          setTransactions(response.payments);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [authToken, initiativeId]);

  return (
    <div className={styles.transactionOverview}>
      <table className={styles.transactionTable}>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FundsTransactions;
