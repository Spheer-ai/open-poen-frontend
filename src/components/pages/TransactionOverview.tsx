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
  const [activePaymentId, setActivePaymentId] = useState<number | null>(null);
  const [activeTransactionId, setActiveTransactionId] = useState<number | null>(
    null,
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      if (user && user.userId && user.token) {
        setIsLoading(true);
        try {
          const data = await fetchPayments(user.userId, user.token);
          console.log("Fetched transactions:", data.payments);
          setTransactions(data.payments || []);
          setIsLoading(false);
          setFilteredTransactions(data.payments || []);
        } catch (error) {
          console.error("Error fetching payments:", error);
          setIsLoading(false);
        }
      }
    };

    fetchTransactions();
  }, [user, refreshTrigger]);

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

  const handleSearch = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    setLowercaseQuery(lowercaseQuery);
    const filtered = transactions.filter((transaction) =>
      Object.entries(transaction).some(([key, value]) => {
        if (typeof value === "string") {
          const valueLower = value.toLowerCase();
          return valueLower.includes(lowercaseQuery);
        } else if (typeof value === "number") {
          const valueString = value.toLocaleString("nl-NL", {
            minimumFractionDigits: 2,
          });
          const valueLower = valueString.toLowerCase();
          return valueLower.includes(lowercaseQuery);
        } else if (value instanceof Date) {
          const formattedDate = formatDate(value.toISOString());
          const formattedDateLower = formattedDate.toLowerCase();
          return formattedDateLower.includes(lowercaseQuery);
        }
        return false;
      }),
    );
    setFilteredTransactions(filtered);
  };

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

  const handleInitiativeLinked = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleActivityLinked = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className={styles.transactionOverview}>
      <TransactionSearchInput onSearch={handleSearch} />
      {isLoading ? (
        <div className={styles["loading-container"]}>
          <LoadingDot delay={0} />
          <LoadingDot delay={0.1} />
          <LoadingDot delay={0.1} />
          <LoadingDot delay={0.2} />
          <LoadingDot delay={0.2} />
        </div>
      ) : (
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
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>
                    {highlightMatch(
                      formatDate(transaction.booking_date),
                      lowercaseQuery,
                    )}
                  </td>
                  <td>
                    <span
                      onClick={() => handleInitiativeClick(transaction.id)}
                      className={`${styles["initiativeText"]} ${
                        openDropdownForPayment === transaction.id
                          ? styles["hidden"]
                          : ""
                      }`}
                    >
                      {openDropdownForPayment !== transaction.id
                        ? transaction.initiative_name || "Verbind initatief"
                        : null}
                    </span>
                    {openDropdownForPayment === transaction.id && (
                      <LinkInitiativeToPayment
                        token={user?.token || ""}
                        paymentId={transaction.id}
                        initiativeName={transaction.initiative_name || ""}
                        onInitiativeLinked={handleInitiativeLinked}
                      />
                    )}
                  </td>
                  <td>
                    {transaction.initiative_id ? (
                      <span
                        onClick={() => setActiveTransactionId(transaction.id)}
                        className={`${styles["initiativeText"]} ${
                          activeTransactionId === transaction.id
                            ? styles["hidden"]
                            : ""
                        }`}
                      >
                        {activeTransactionId !== transaction.id
                          ? transaction.activity_name ||
                            "Verbind een activiteit"
                          : null}
                      </span>
                    ) : (
                      <span
                        className={`${styles["initiativeText"]} ${
                          activeTransactionId === transaction.id
                            ? styles["hidden"]
                            : ""
                        }`}
                        style={{ color: "grey" }}
                      >
                        Verbind een activiteit
                      </span>
                    )}
                    {activeTransactionId === transaction.id && (
                      <LinkActivityToPayment
                        token={user?.token || ""}
                        paymentId={transaction.id}
                        initiativeId={transaction.initiative_id}
                        activityName={transaction.activity_name || ""}
                        onActivityLinked={handleActivityLinked}
                      />
                    )}
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionOverview;
