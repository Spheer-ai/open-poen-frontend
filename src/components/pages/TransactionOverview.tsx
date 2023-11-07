import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { fetchPayments } from "../middleware/Api";
import styles from "../../assets/scss/TransactionOverview.module.scss";

const TransactionOverview = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("nl-NL", options);
  };
  useEffect(() => {
    const fetchTransactions = async () => {
      if (user && user.userId && user.token) {
        setIsLoading(true);
        try {
          const data = await fetchPayments(user.userId, user.token);
          setTransactions(data.payments || []);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching payments:", error);
          setIsLoading(false);
        }
      }
    };

    fetchTransactions();
  }, [user]);

  return (
    <div className={styles.transactionOverview}>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table className={styles.transactionTable}>
          <thead>
            <tr>
              <th>Datum</th>
              <th>Initiatief</th>
              <th>Activiteit</th>
              <th>Ontvanger</th>
              <th>Beschrijving</th>
              <th>IBAN</th>
              <th>Bedrag</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{formatDate(transaction.booking_date)}</td>
                <td>{transaction.initiative_name}</td>
                <td>{transaction.activity_name}</td>
                <td>{transaction.creditor_name}</td>
                <td>{transaction.short_user_description}</td>
                <td>{transaction.iban}</td>
                <td>{transaction.transaction_amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionOverview;
