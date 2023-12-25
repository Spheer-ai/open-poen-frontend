import React, { useEffect, useState } from "react";
import { getPaymentsByActivity } from "../../../middleware/Api";
import styles from "../../../../assets/scss/TransactionOverview.module.scss";
import PaymentDetails from "../../../modals/PaymentDetails";
import EditIcon from "/edit-icon.svg";
import ViewIcon from "/eye.svg";
import { useNavigate } from "react-router-dom";
import EditPayment from "../../../modals/EditPayment";
import AddPayment from "../../../modals/AddPayment";
import { usePermissions } from "../../../../contexts/PermissionContext";
import { useAuth } from "../../../../contexts/AuthContext";
import LoadingDot from "../../../animation/LoadingDot";

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
const ActivityTransactions: React.FC<{
  authToken: string;
  initiativeId: string;
  activityId: string;
}> = ({ authToken, initiativeId, activityId }) => {
  const { user } = useAuth();
  const { fetchPermissions } = usePermissions();
  const [hasEditPermission, setHasEditPermission] = useState(false);
  const [hasReadPermission, setHasReadPermission] = useState(false);
  const [hasDeletePermission, setHasDeletePermission] = useState(false);
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
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreTransactions, setHasMoreTransactions] = useState(true);
  const [pageSize] = useState(3);

  const fetchTransactions = async () => {
    try {
      setLoadingMore(true);
      const response = await getPaymentsByActivity(
        authToken,
        initiativeId,
        activityId,
        currentPage,
        pageSize,
      );

      if (response && response.payments) {
        const formattedTransactions = response.payments.map((transaction) => ({
          ...transaction,
          booking_date: formatDate(transaction.booking_date),
        }));

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
    fetchTransactions();
  }, [currentPage]);

  useEffect(() => {
    async function fetchUserPermissions() {
      try {
        let userToken = authToken;

        if (user && user.token && activityId && transactions.length > 0) {
          userToken = user.token;

          console.log(
            "Transaction IDs:",
            transactions.map((transaction) => transaction.transaction_id),
          );

          for (const transaction of transactions) {
            const transactionId = transaction.id;

            if (transactionId) {
              const userPermissions: string[] | undefined =
                await fetchPermissions("Payment", transactionId, userToken);

              console.log(
                `API Request for permissions for transaction ${transactionId}:`,
              );
              console.log({
                resourceType: "Payment",
                resourceId: transactionId,
                userToken,
              });

              console.log(
                `API Response for permissions for transaction ${transactionId}:`,
              );
              console.log(userPermissions);

              if (userPermissions && userPermissions.includes("read")) {
                console.log(
                  `User has read permission for transaction ${transactionId}`,
                );
                setHasReadPermission(true);
              } else {
                console.log(
                  `User does not have edit permission for transaction ${transactionId}`,
                );
                setHasReadPermission(false);
              }

              if (userPermissions && userPermissions.includes("edit")) {
                console.log(
                  `User has edit permission for transaction ${transactionId}`,
                );
                setHasEditPermission(true);
              } else {
                console.log(
                  `User does not have edit permission for transaction ${transactionId}`,
                );
                setHasEditPermission(false);
              }

              if (userPermissions && userPermissions.includes("delete")) {
                console.log(
                  `User has delete permission for transaction ${transactionId}`,
                );
              } else {
                console.log(
                  `User does not have delete permission for transaction ${transactionId}`,
                );
              }
            } else {
              console.error("Transaction ID is undefined for a transaction");
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch user permissions:", error);
      }
    }

    fetchUserPermissions();
  }, [user, activityId, transactions, authToken]);

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

        setSelectedTransaction({
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
                <td>
                  {new Date(transaction.booking_date).toLocaleDateString(
                    "nl-NL",
                    { year: "numeric", month: "numeric", day: "numeric" },
                  )}
                </td>
                <td>{`${transaction.activity_name} ${transaction.short_user_description}`}</td>
                <td>{transaction.creditor_name}</td>
                <td>{transaction.debtor_name}</td>
                <td>{transaction.n_attachments}</td>
                <td>{transaction.transaction_amount}</td>
                <td>
                  {hasEditPermission ? (
                    <img
                      src={EditIcon}
                      alt="Edit Icon"
                      onClick={() => handleTransactionEditClick(transaction.id)}
                      style={{ cursor: "pointer" }}
                    />
                  ) : (
                    <img
                      src={ViewIcon}
                      alt="View Icon"
                      onClick={() =>
                        handleTransactionDetailsClick(transaction.id)
                      }
                      style={{
                        cursor: "pointer",
                        width: "24px",
                        height: "24px",
                      }}
                    />
                  )}
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
                <div className={styles["loading-dots"]}>
                  <LoadingDot delay={0} />
                  <LoadingDot delay={0.1} />
                  <LoadingDot delay={0.1} />
                  <LoadingDot delay={0.2} />
                  <LoadingDot delay={0.2} />
                </div>
              ) : (
                "Load More"
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
          paymentData={selectedTransaction}
          token={authToken}
        />
      </div>
    </>
  );
};

export default ActivityTransactions;
