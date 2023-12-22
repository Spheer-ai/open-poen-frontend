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
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lowercaseQuery, setLowercaseQuery] = useState<string>("");
  const [sortCriteria, setSortCriteria] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<string>("asc");
  const [openDropdownForPayment, setOpenDropdownForPayment] = useState<
    number | null
  >(null);
  const [openDropdownForActivity, setOpenDropdownForActivity] = useState<
    number | null
  >(null);

  const [activePaymentId, setActivePaymentId] = useState<number | null>(null);
  const [activeTransactionId, setActiveTransactionId] = useState<number | null>(
    null,
  );
  const [transactionsWithInitiatives, setTransactionsWithInitiatives] =
    useState<any[]>([]);
  const [initiativeLinkingStatus, setInitiativeLinkingStatus] = useState<
    Record<number, boolean>
  >({});
  const [activityLinkingStatus, setActivityLinkingStatus] = useState<
    Record<number, boolean>
  >({});
  const [activeInitiativeId, setActiveInitiativeId] = useState<number | null>(
    null,
  );
  const [linkedActivityIds, setLinkedActivityIds] = useState<
    Record<number, number | null>
  >({});
  const [linkedActivities, setLinkedActivities] = useState<
    Record<number, number | null>
  >({});
  const [selectedActivities, setSelectedActivities] = useState<
    Record<number, string | null>
  >({});
  const [linkedActivityNames, setLinkedActivityNames] = useState<
    Record<number, string | null>
  >({});
  const [isActivityLinkingEnabled, setIsActivityLinkingEnabled] =
    useState<boolean>(
      true, // Set the initial state based on your requirements
    );
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(3);
  const [totalTransactionsCount, setTotalTransactionsCount] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const [allTransactions, setAllTransactions] = useState<any[]>([]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    setTransactions(allTransactions.slice(0, limit));
  }, [allTransactions, limit]);

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
        );
        console.log("Fetched transactions:", data.payments);

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

  const highlightMatch = (text: string | null, query: string) => {
    if (query === "") {
      return text;
    }

    if (text == null) {
      return null;
    }

    if (typeof text === "string" && /\d{2}-\d{2}-\d{4}/.test(text)) {
      const [day, month, year] = text.split("-");

      const regex = new RegExp(`(${query})`, "gi");
      const dayPart = regex.test(day) ? (
        <span className={styles.highlight}>{day}</span>
      ) : (
        day
      );
      const monthPart = regex.test(month) ? (
        <span className={styles.highlight}>{month}</span>
      ) : (
        month
      );
      const yearPart = regex.test(year) ? (
        <span className={styles.highlight}>{year}</span>
      ) : (
        year
      );

      return (
        <span>
          {dayPart}-{monthPart}-{yearPart}
        </span>
      );
    }

    const regex = new RegExp(`(${query})`, "gi");
    return text
      .toString()
      .split(regex)
      .map((part, index) => {
        return regex.test(part) ? (
          <span key={index} className={styles.highlight}>
            {part}
          </span>
        ) : (
          part
        );
      });
  };

  const handleSearch = (query: string) => {};

  const handleSort = (criteria: string) => {
    if (criteria === sortCriteria) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortCriteria(criteria);
      setSortDirection("asc");
    }

    const sortedTransactions = [...filteredTransactions];

    sortedTransactions.sort((a, b) => {
      if (criteria === "iban") {
        const ibanA = (a[criteria] || "").replace(/[^0-9]/g, "");
        const ibanB = (b[criteria] || "").replace(/[^0-9]/g, "");

        if (sortDirection === "asc") {
          return ibanA.localeCompare(ibanB);
        } else {
          return ibanB.localeCompare(ibanA);
        }
      } else if (criteria === "booking_date") {
        const dateA: Date | any = new Date(a[criteria]);
        const dateB: Date | any = new Date(b[criteria]);

        if (sortDirection === "asc") {
          return dateA - dateB;
        } else {
          return dateB - dateA;
        }
      } else if (criteria === "transaction_amount") {
        const priceA: number = a[criteria];
        const priceB: number = b[criteria];

        if (sortDirection === "asc") {
          return priceA - priceB;
        } else {
          return priceB - priceA;
        }
      } else {
      }
    });

    setFilteredTransactions(sortedTransactions);
  };

  const getSortIndicator = (criteria: string) => {
    if (criteria === sortCriteria) {
      return sortDirection === "asc" ? "↑" : "↓";
    }

    return "";
  };

  const getHeaderStyle = (criteria: string) => {
    const headerStyle: React.CSSProperties = {
      cursor: "pointer",
      color: criteria === sortCriteria ? "#2660d5" : "grey",
    };

    return headerStyle;
  };

  const handleInitiativeClick = (paymentId: number) => {
    setOpenDropdownForPayment(paymentId);
  };

  const handleInitiativeLinked = (
    transactionId: number,
    initiativeId: number | null,
  ) => {
    const updatedTransactions = transactionsWithInitiatives.map(
      (transaction) => {
        if (transaction.id === transactionId) {
          return {
            ...transaction,
            initiative_id: initiativeId,
          };
        }
        return transaction;
      },
    );

    setTransactionsWithInitiatives(updatedTransactions);
    setInitiativeLinkingStatus((prevStatus) => ({
      ...prevStatus,
      [transactionId]: initiativeId !== null,
    }));
    setActiveInitiativeId(initiativeId);
    setIsActivityLinkingEnabled(initiativeId === null);
  };

  const handleActivityLinked = (
    transactionId: number,
    activityId: number | null,
  ) => {
    setSelectedActivities((prevSelectedActivities) => ({
      ...prevSelectedActivities,
      [transactionId]: activityId !== null ? activityId.toString() : null,
    }));

    setActivityLinkingStatus((prevActivityLinkingStatus) => ({
      ...prevActivityLinkingStatus,
      [transactionId]: activityId !== null,
    }));

    setOpenDropdownForActivity(null);
  };

  return (
    <div className={styles.transactionOverview}>
      <TransactionSearchInput onSearch={handleSearch} />
      <div className={styles["transaction-table-container"]}>
        <table className={styles.transactionTable}>
          <thead>
            <tr>
              <th
                onClick={() => handleSort("booking_date")}
                style={getHeaderStyle("booking_date")}
              >
                Datum {getSortIndicator("booking_date")}
              </th>
              <th
                onClick={() => handleSort("initiative_name")}
                style={getHeaderStyle("initiative_name")}
              >
                Initiatief {getSortIndicator("initiative_name")}
              </th>
              <th
                onClick={() => handleSort("activity_name")}
                style={getHeaderStyle("activity_name")}
              >
                Activiteit {getSortIndicator("activity_name")}
              </th>
              <th
                onClick={() => handleSort("creditor_name")}
                style={getHeaderStyle("creditor_name")}
              >
                Ontvanger {getSortIndicator("creditor_name")}
              </th>
              <th
                onClick={() => handleSort("short_user_description")}
                style={getHeaderStyle("short_user_description")}
              >
                Beschrijving {getSortIndicator("short_user_description")}
              </th>
              <th
                onClick={() => handleSort("iban")}
                style={getHeaderStyle("iban")}
              >
                IBAN {getSortIndicator("iban")}
              </th>
              <th
                onClick={() => handleSort("transaction_amount")}
                style={getHeaderStyle("transaction_amount")}
              >
                Bedrag {getSortIndicator("transaction_amount")}
              </th>
            </tr>
          </thead>
          <tbody>
            {allTransactions.length ? (
              allTransactions.map((transaction, index) => (
                <tr key={`${transaction.id}-${index}`}>
                  <td>
                    {highlightMatch(
                      formatDate(transaction.booking_date),
                      lowercaseQuery,
                    )}
                  </td>
                  <td>
                    <LinkInitiativeToPayment
                      token={user?.token || ""}
                      paymentId={transaction.id}
                      initiativeId={transaction.initiative_id || null}
                      onInitiativeLinked={(initiativeId) =>
                        handleInitiativeLinked(transaction.id, initiativeId)
                      }
                      initiativeName={transaction.initiative_name || ""}
                      isActivityLinked={
                        activityLinkingStatus[transaction.id] || false
                      }
                    />
                  </td>
                  <td>
                    <LinkActivityToPayment
                      token={user?.token || ""}
                      paymentId={transaction.id}
                      initiativeId={transaction.initiative_id}
                      activityName={transaction.activity_name || ""}
                      onActivityLinked={(transactionId, activityId) =>
                        handleActivityLinked(
                          transactionId,
                          activityId as number | null,
                        )
                      }
                      linkedActivityId={
                        linkedActivities[transaction.id] || null
                      }
                      isInitiativeLinked={
                        initiativeLinkingStatus[transaction.id] || false
                      }
                    />
                  </td>

                  <td>
                    {highlightMatch(transaction.creditor_name, lowercaseQuery)}
                  </td>
                  <td>
                    {highlightMatch(
                      transaction.short_user_description,
                      lowercaseQuery,
                    )}
                  </td>
                  <td>{highlightMatch(transaction.iban, lowercaseQuery)}</td>
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
                    {highlightMatch(
                      Math.abs(transaction.transaction_amount).toLocaleString(
                        "nl-NL",
                        { minimumFractionDigits: 2 },
                      ),
                      lowercaseQuery,
                    )}
                  </td>
                </tr>
              ))
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
