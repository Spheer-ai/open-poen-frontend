import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { fetchPayments } from "../middleware/Api";
import styles from "../../assets/scss/TransactionOverview.module.scss";
import TransactionSearchInput from "../elements/search/transactions/TransactionSearchInput";
import LinkInitiativeToPayment from "../elements/dropdown-menu/initiatives/LinkInitiativeToPayment";
import LinkActivityToPayment from "../elements/dropdown-menu/activities/LinkActivityToPayment";
import LoadingDot from "../animation/LoadingDot";

const TransactionOverview = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(3);
  const [totalTransactionsCount, setTotalTransactionsCount] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [linkingStatus, setLinkingStatus] = useState<
    Record<number, { initiativeId: number | null; activityId: number | null }>
  >({});

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    setTransactions(allTransactions.slice(0, limit));
  }, [allTransactions, linkingStatus, searchQuery, limit]);

  useEffect(() => {
    const filtered = allTransactions.filter((transaction) => {
      const initiativeNameMatch =
        transaction.initiative_name &&
        transaction.initiative_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const activityNameMatch =
        transaction.activity_name &&
        transaction.activity_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const ibanMatch =
        transaction.iban &&
        transaction.iban.toLowerCase().includes(searchQuery.toLowerCase());

      return initiativeNameMatch || activityNameMatch || ibanMatch;
    });

    setFilteredTransactions(filtered);
    setTransactions(filtered.slice(0, limit));
  }, [allTransactions, limit, searchQuery]);

  const handleLoadMore = async () => {
    const newOffset = offset + limit;
    setIsLoadingMore(true);
    await fetchTransactions(newOffset);
  };

  const fetchTransactions = async (newOffset: number) => {
    if (user && user.userId && user.token) {
      setIsLoading(true);
      try {
        const data = await fetchPayments(
          user.userId,
          user.token,
          newOffset,
          limit,
          searchQuery,
        );
        const updatedLinkingStatus = { ...linkingStatus };

        data.payments.forEach((transaction) => {
          updatedLinkingStatus[transaction.id] = {
            initiativeId: transaction.initiative_id || null,
            activityId: transaction.activity_id || null,
          };
        });

        setLinkingStatus(updatedLinkingStatus);

        setTotalTransactionsCount(data.totalCount || 0);

        setAllTransactions((prevAllTransactions) => [
          ...prevAllTransactions,
          ...data.payments,
        ]);
        setIsLoading(false);
        setIsLoadingMore(false);
        setOffset(newOffset);
      } catch (error) {
        console.error("Error fetching payments:", error);
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log("Search Query:", query);
  };

  const handleInitiativeLinked = (
    transactionId: number,
    initiativeId: number | null,
  ) => {
    setLinkingStatus((prevStatus) => {
      const newStatus = {
        ...prevStatus,
        [transactionId]: {
          initiativeId,
          activityId: prevStatus[transactionId]?.activityId || null,
        },
      };
      return newStatus;
    });
  };

  const handleActivityLinked = (
    transactionId: number,
    activityId: number | null,
  ) => {
    setLinkingStatus((prevStatus) => {
      const newStatus = {
        ...prevStatus,
        [transactionId]: {
          initiativeId: prevStatus[transactionId]?.initiativeId || null,
          activityId,
        },
      };
      return newStatus;
    });
  };

  return (
    <div className={styles.transactionOverview}>
      <TransactionSearchInput onSearch={handleSearch} />
      <div className={styles["transaction-table-container"]}>
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
            {filteredTransactions.length ? (
              filteredTransactions.map((transaction, index) => {
                const isInitiativeLinked =
                  linkingStatus[transaction.id]?.initiativeId !== null;
                const isActivityLinked =
                  linkingStatus[transaction.id]?.activityId !== null;

                return (
                  <tr key={`${transaction.id}-${index}`}>
                    <td>{formatDate(transaction.booking_date)}</td>
                    <td>
                      <LinkInitiativeToPayment
                        token={user?.token || ""}
                        paymentId={transaction.id}
                        initiativeName={transaction.initiative_name || ""}
                        initiativeId={transaction.initiative_id || null}
                        onInitiativeLinked={(initiativeId) =>
                          handleInitiativeLinked(transaction.id, initiativeId)
                        }
                        isActivityLinked={
                          linkingStatus[transaction.id]?.activityId !== null
                        }
                        linkingStatus={linkingStatus}
                      />
                    </td>
                    <td>
                      <LinkActivityToPayment
                        token={user?.token || ""}
                        paymentId={transaction.id}
                        initiativeId={
                          linkingStatus[transaction.id]?.initiativeId ||
                          transaction.initiative_id
                        }
                        activityName={transaction.activity_name || ""}
                        onActivityLinked={(transactionId, activityId) =>
                          handleActivityLinked(
                            transactionId,
                            activityId as number | null,
                          )
                        }
                        linkedActivityId={
                          linkingStatus[transaction.id]?.activityId || null
                        }
                        isInitiativeLinked={isInitiativeLinked}
                        linkingStatus={linkingStatus}
                      />
                    </td>
                    <td>{transaction.creditor_name}</td>
                    <td>{transaction.short_user_description}</td>
                    <td>{transaction.iban}</td>
                    <td>
                      <span
                        style={{
                          display: "inline-block",
                          width: "20px",
                          textAlign: "right",
                        }}
                      >
                        {transaction.transaction_amount < 0 ? "-" : ""}
                      </span>
                      €{" "}
                      {Math.abs(transaction.transaction_amount).toLocaleString(
                        "nl-NL",
                        { minimumFractionDigits: 2 },
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7}>Geen transactie gevonden</td>
              </tr>
            )}
          </tbody>
        </table>
        {isLoadingMore ? (
          <div className={styles["loading-container"]}>
            <LoadingDot delay={0} />
            <LoadingDot delay={0.1} />
            <LoadingDot delay={0.1} />
            <LoadingDot delay={0.2} />
            <LoadingDot delay={0.2} />
          </div>
        ) : (
          <button onClick={handleLoadMore}>Meer transacties laden</button>
        )}
      </div>
    </div>
  );
};

export default TransactionOverview;
