import React, { useEffect, useState } from "react";
import { getPaymentsByInitiative } from "../../../middleware/Api";
import styles from "../../../../assets/scss/TransactionOverview.module.scss";
import PaymentDetails from "../../../modals/PaymentDetails";
import ViewIcon from "/eye.svg";
import { useNavigate } from "react-router-dom";
import EditPayment from "../../../modals/EditPayment";
import AddPayment from "../../../modals/AddPayment";
import { usePermissions } from "../../../../contexts/PermissionContext";
import { useFieldPermissions } from "../../../../contexts/FieldPermissionContext";
import { useAuth } from "../../../../contexts/AuthContext";
import LoadingDot from "../../../animation/LoadingDot";

export interface Transaction {
  id: number;
  booking_date: string;
  activity_name: string;
  creditor_name: string;
  debtor_name: string;
  short_user_description: string;
  transaction_amount: number;
  n_attachments: number;
  transaction_id: number;
  creditor_account: string;
  debtor_account: string;
  route: string;
  long_user_description: string;
  hidden: boolean;
}

const formatDate = (dateString: string) => {
  if (!dateString) {
    return "";
  }
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    return date.toISOString();
  } else {
    return "";
  }
};

const FundsTransactions: React.FC<{
  authToken: string;
  initiativeId: string;
  onRefreshTrigger: () => void;
  entityPermissions;
}> = ({ authToken, initiativeId, onRefreshTrigger }) => {
  const { user } = useAuth();
  const { fetchPermissions } = usePermissions();
  const navigate = useNavigate();
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    number | null
  >(null);
  const [isBlockingInteraction, setIsBlockingInteraction] = useState(false);
  const [isFetchPaymentDetailsModalOpen, setIsFetchPaymentDetailsModalOpen] =
    useState(false);
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const [isEditPaymentModalOpen, setIsEditPaymentModalOpen] = useState(false);
  const { fetchFieldPermissions } = useFieldPermissions();
  const [currentPage, setCurrentPage] = useState(1);
  const [entityPermissions, setEntityPermissions] = useState<string[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreTransactions, setHasMoreTransactions] = useState(true);
  const [editedTransaction, setEditedTransaction] =
    useState<Transaction | null>(null);
  const [
    permissionsFetchedForTransaction,
    setPermissionsFetchedForTransaction,
  ] = useState<number | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [hasEditPermission, setHasEditPermission] = useState<
    boolean | undefined
  >(false);
  const [hasReadPermission, setHasReadPermission] = useState<
    boolean | undefined
  >(false);
  const [pageSize] = useState(20);

  const fetchTransactions = async () => {
    try {
      setLoadingMore(true);
      const response = await getPaymentsByInitiative(
        authToken,
        initiativeId,
        currentPage,
        pageSize,
      );

      if (response && response.payments) {
        const formattedTransactions = response.payments.map((payment) => ({
          ...payment,
          ...payment.payment,
          booking_date: formatDate(payment.payment.booking_date),
        }));

        console.log("Fetched transactions:", formattedTransactions);

        if (formattedTransactions.length > 0) {
          if (currentPage === 1) {
            setTransactions(formattedTransactions);
          } else {
            setTransactions((prevTransactions) => [
              ...prevTransactions,
              ...formattedTransactions,
            ]);
          }

          if (formattedTransactions.length < pageSize) {
            setHasMoreTransactions(false);
          }
        } else {
          setHasMoreTransactions(false);
        }
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMoreTransactions) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    console.log("FundsTransactions component mounted or refreshed.");

    fetchTransactions();
  }, [currentPage, refreshTrigger]);

  const handleFetchPermissions = async (transactionId: number) => {
    try {
      const userToken = user && user.token ? user.token : authToken;
      const userPermissions: string[] | undefined = await fetchPermissions(
        "Payment",
        transactionId,
        userToken,
      );

      const hasEditPermission =
        userPermissions && userPermissions.includes("edit");
      setHasEditPermission(hasEditPermission);

      const hasReadPermission =
        userPermissions && userPermissions.includes("read");
      setHasReadPermission(hasReadPermission);

      setPermissionsFetchedForTransaction(transactionId);
    } catch (error) {
      console.error("Failed to fetch user permissions:", error);
    }
  };

  const handleEyeIconClick = async (transactionId: number) => {
    if (permissionsFetchedForTransaction !== transactionId) {
      await handleFetchPermissions(transactionId);
    }

    if (hasEditPermission) {
      handleTransactionEditClick(transactionId);
    } else {
      handleTransactionDetailsClick(transactionId);
    }
  };

  const handleTransactionDetailsClick = (transactionId: number) => {
    setSelectedTransactionId(transactionId);

    console.log(`Selected Transaction ID: ${transactionId}`);

    setIsFetchPaymentDetailsModalOpen(true);
  };

  const handleTransactionEditClick = (transactionId: number) => {
    setSelectedTransactionId(transactionId);
    const selectedTransaction = transactions.find(
      (transaction) => transaction.id === transactionId,
    );

    if (selectedTransaction && selectedTransaction.booking_date) {
      const newDate = new Date(selectedTransaction.booking_date);
      if (!isNaN(newDate.getTime())) {
        const isoDate = newDate.toISOString();

        console.log("Selected Transaction ID:", transactionId);

        setEditedTransaction({
          ...selectedTransaction,
          booking_date: isoDate,
        });
        setIsEditPaymentModalOpen(true);
      } else {
        console.error(
          "Invalid booking_date format:",
          selectedTransaction.booking_date,
        );
      }
    }
  };

  useEffect(() => {
    async function fetchFieldPermissionsOnMount() {
      try {
        if (user && user.token && selectedTransactionId) {
          const fieldPermissions: string[] | undefined =
            await fetchFieldPermissions(
              "Payment",
              selectedTransactionId,
              user.token,
            );

          if (fieldPermissions) {
            setEntityPermissions(fieldPermissions);
          }
        }
      } catch (error) {
        console.error("Failed to fetch field permissions:", error);
      }
    }

    fetchFieldPermissionsOnMount();
  }, [user, selectedTransactionId, fetchFieldPermissions]);

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

  const handleToggleAddPaymentModal = () => {
    if (isAddPaymentModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsAddPaymentModalOpen(false);
        navigate(`/funds/${initiativeId}/activities`);
      }, 300);
    } else {
      setIsAddPaymentModalOpen(true);
      navigate(`/funds/${initiativeId}/activities/add-payment`);
    }
  };

  useEffect(() => {
    if (refreshTrigger > 0) {
      console.log(
        `Refresh triggered. Current trigger count: ${refreshTrigger}`,
      );
      fetchTransactions();
    }
  }, [refreshTrigger]);

  const handlePaymentEdited = () => {
    console.log("Payment edited. Triggering refresh.");
    setRefreshTrigger((prev) => prev + 1);
    onRefreshTrigger();
  };

  const handlePaymentAdded = () => {
    console.log("Payment edited. Triggering refresh.");
    setRefreshTrigger((prev) => prev + 1);
    onRefreshTrigger();
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
        activityId={null}
      />
      {user ? (
        <button
          className={styles["saveButton"]}
          onClick={handleToggleAddPaymentModal}
        >
          Transactie toevoegen
        </button>
      ) : null}
      <div className={styles.fundTransactionOverview}>
        <table key={refreshTrigger} className={styles.fundTransactionTable}>
          <thead>
            <tr>
              <th>DATUM</th>
              <th>Activiteit</th>
              <th>VERZENDER</th>
              <th>ONTVANGER</th>
              <th>MEDIA</th>
              <th>HOEVEELHEID</th>
            </tr>
          </thead>
          {transactions.length === 0 && !loadingMore ? (
            <p className={styles["no-transactions"]}>
              Geen transacties gevonden
            </p>
          ) : null}
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td>
                  {new Date(transaction.booking_date).toLocaleDateString(
                    "nl-NL",
                    { year: "numeric", month: "numeric", day: "numeric" },
                  )}
                </td>
                <td>
                  {transaction.activity_name ? (
                    <div
                      style={{
                        color: "#265ED4",
                        fontWeight: "bold",
                        fontSize: "14px",
                        marginBottom: "2px",
                      }}
                    >
                      {transaction.activity_name}
                    </div>
                  ) : (
                    <div
                      style={{
                        color: "blue",
                        fontWeight: "bold",
                        fontSize: "14px",
                        marginBottom: "2px",
                      }}
                    >
                      -
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: "12px",
                    }}
                  >
                    {transaction.short_user_description}
                  </div>
                </td>
                <td>{transaction.creditor_name}</td>
                <td>{transaction.debtor_name}</td>
                <td>{transaction.n_attachments}</td>
                <td
                  className={
                    transaction.transaction_amount < 0 ? styles["red-text"] : ""
                  }
                >
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
                <td>{transaction.transaction_id}</td>
                <td>
                  <img
                    src={ViewIcon}
                    alt="Eye Icon"
                    onClick={() => handleEyeIconClick(transaction.id)}
                    style={{ cursor: "pointer" }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {hasMoreTransactions && (
          <div className={styles.loadMoreButtonContainer}>
            <button
              className={styles.loadMoreButton}
              onClick={handleLoadMore}
              disabled={loadingMore}
            >
              {loadingMore ? (
                <div className={styles["loading-container"]}>
                  <LoadingDot delay={0} />
                  <LoadingDot delay={0.1} />
                  <LoadingDot delay={0.1} />
                  <LoadingDot delay={0.2} />
                  <LoadingDot delay={0.2} />
                </div>
              ) : (
                "Meer transacties laden"
              )}
            </button>
          </div>
        )}
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
          paymentData={editedTransaction}
          token={authToken}
          fieldPermissions={entityPermissions}
          fields={[]}
        />
      </div>
    </>
  );
};

export default FundsTransactions;
