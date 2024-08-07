import React, { useEffect, useRef, useState, useCallback } from "react";
import { getPaymentsByInitiative } from "../../../middleware/Api";
import styles from "../../../../assets/scss/TransactionOverview.module.scss";
import PaymentDetails from "../../../modals/PaymentDetails";
import { useNavigate } from "react-router-dom";
import EditPayment from "../../../modals/EditPayment";
import AddPayment from "../../../modals/AddPayment";
import { useFetchEntityPermissions } from "../../../hooks/useFetchPermissions";
import { useAuth } from "../../../../contexts/AuthContext";
import LoadingDot from "../../../animation/LoadingDot";
import LoadingCircle from "../../../animation/LoadingCircle";
import FilterPayment from "../../../modals/FilterPayment";
import useCachedImages from "../../../utils/images";

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
  entityPermissions: string[];
  hasCreatePaymentPermission: boolean;
}> = ({
  authToken,
  initiativeId,
  onRefreshTrigger,
  entityPermissions,
  hasCreatePaymentPermission,
}) => {
  const { user } = useAuth();
  const { fetchPermissions } = useFetchEntityPermissions();
  const [hasDeletePermission, setHasDeletePermission] = useState<
    boolean | undefined
  >(false);
  const navigate = useNavigate();
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    number | null
  >(null);
  const [isBlockingInteraction, setIsBlockingInteraction] = useState(false);
  const [isFetchPaymentDetailsModalOpen, setIsFetchPaymentDetailsModalOpen] =
    useState(false);
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const [isFilterPaymentModalOpen, setIsFilterPaymentModalOpen] =
    useState(false);
  const [isEditPaymentModalOpen, setIsEditPaymentModalOpen] = useState(false);
  const images = useCachedImages(["view"]);

  const [currentPage, setCurrentPage] = useState(1);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingMore, setLoadingMore] = useState(true);
  const [hasMoreTransactions, setHasMoreTransactions] = useState(true);
  const [editedTransaction, setEditedTransaction] =
    useState<Transaction | null>(null);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [pageSize] = useState(20);
  const [filterCriteria, setFilterCriteria] = useState<{
    startDate: string;
    endDate: string;
    minAmount: string;
    maxAmount: string;
    route: string;
  }>({
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
    route: "",
  });
  const [isAtBottom, setIsAtBottom] = useState(false);
  const sidePanelRef = useRef<HTMLDivElement | null>(null);

  const checkBottom = () => {
    const sidePanel = sidePanelRef.current;

    if (sidePanel) {
      const scrollY = sidePanel.scrollTop;
      const panelHeight = sidePanel.clientHeight;
      const contentHeight = sidePanel.scrollHeight;

      const threshold = 20;

      setIsAtBottom(contentHeight - (scrollY + panelHeight) < threshold);
    }
  };

  const fetchTransactions = useCallback(async () => {
    try {
      setLoadingMore(true);

      const queryParams: {
        offset: number;
        limit: number;
        start_date?: string;
        end_date?: string;
        min_amount?: string;
        max_amount?: string;
        route?: string;
      } = {
        offset: (currentPage - 1) * pageSize,
        limit: pageSize,
      };

      if (filterCriteria.startDate)
        queryParams.start_date = filterCriteria.startDate;
      if (filterCriteria.endDate) queryParams.end_date = filterCriteria.endDate;
      if (filterCriteria.minAmount)
        queryParams.min_amount = filterCriteria.minAmount;
      if (filterCriteria.maxAmount)
        queryParams.max_amount = filterCriteria.maxAmount;
      if (filterCriteria.route) queryParams.route = filterCriteria.route;

      const response = await getPaymentsByInitiative(
        authToken,
        initiativeId,
        currentPage,
        pageSize,
        queryParams,
      );

      if (response) {
        const formattedTransactions = response.payments
          ? response.payments.map((payment) => ({
              ...payment,
              ...payment.payment,
              booking_date: formatDate(payment.payment.booking_date),
            }))
          : [];

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
          } else {
            setHasMoreTransactions(true);
          }
        } else {
          setTransactions([]);
          setHasMoreTransactions(false);
        }
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [authToken, initiativeId, currentPage, pageSize, filterCriteria]);

  useEffect(() => {
    fetchTransactions();
  }, [filterCriteria, fetchTransactions]);

  const handleFilterApplied = (filters: {
    startDate?: string;
    endDate?: string;
    minAmount?: string;
    maxAmount?: string;
    route?: string;
  }) => {
    setFilterCriteria({
      startDate: filters.startDate || "",
      endDate: filters.endDate || "",
      minAmount: filters.minAmount || "",
      maxAmount: filters.maxAmount || "",
      route: filters.route || "",
    });
    setCurrentPage(1);
  };

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMoreTransactions) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }, [loadingMore, hasMoreTransactions]);

  const handleEyeIconClick = async (transactionId: number) => {
    setIsLoadingPermissions(true);

    try {
      const userToken = user && user.token ? user.token : authToken;
      const entityClass = "Payment";

      const userPermissions: string[] | undefined = await fetchPermissions(
        entityClass,
        transactionId,
        userToken,
      );

      const hasEditPermission = userPermissions?.includes("edit") ?? false;
      const hasDeletePermission = userPermissions?.includes("delete") ?? false;

      setHasDeletePermission(hasDeletePermission);

      setSelectedTransactionId(transactionId);

      if (hasEditPermission) {
        handleTransactionEditClick(transactionId);
      } else {
        handleTransactionDetailsClick(transactionId);
      }
    } catch (error) {
      console.error("Failed to fetch user permissions:", error);
    } finally {
      setIsLoadingPermissions(false);
    }
  };

  const handleTransactionDetailsClick = (transactionId: number) => {
    setSelectedTransactionId(transactionId);
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

        setEditedTransaction({
          ...selectedTransaction,
          booking_date: isoDate,
          activity_name: selectedTransaction.activity_name,
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
        navigate(`/funds/${initiativeId}`);
      }, 300);
    } else {
      setIsFetchPaymentDetailsModalOpen(true);
      navigate(`/funds/${initiativeId}/${initiativeId}/details`);
    }
  };

  const handleToggleEditPaymentModal = () => {
    if (isEditPaymentModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsEditPaymentModalOpen(false);
        navigate(`/funds/${initiativeId}`);
      }, 300);
    } else {
      setIsEditPaymentModalOpen(true);
      navigate(`/funds/${initiativeId}/${selectedTransactionId}/details`);
    }
  };

  const handleToggleAddPaymentModal = () => {
    if (isAddPaymentModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsAddPaymentModalOpen(false);
        navigate(`/funds/${initiativeId}`);
      }, 300);
    } else {
      setIsAddPaymentModalOpen(true);
      navigate(`/funds/${initiativeId}/add-payment`);
    }
  };

  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchTransactions();
    }
  }, [refreshTrigger, fetchTransactions]);

  const handlePaymentEdited = () => {
    setRefreshTrigger((prev) => prev + 1);
    onRefreshTrigger();
  };

  const handlePaymentAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
    onRefreshTrigger();
  };

  const handleToggleFilterPaymentModal = () => {
    if (isFilterPaymentModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsFilterPaymentModalOpen(false);
        navigate(`/funds/${initiativeId}`);
      }, 300);
    } else {
      setIsFilterPaymentModalOpen(true);
      navigate(`/funds/${initiativeId}/filter-payment`);
    }
  };

  useEffect(() => {
    const sidePanel = sidePanelRef.current;

    if (sidePanel) {
      sidePanel.addEventListener("scroll", checkBottom);

      return () => {
        sidePanel.removeEventListener("scroll", checkBottom);
      };
    }
  }, []);

  useEffect(() => {
    if (isAtBottom) {
      handleLoadMore();
    }
  }, [isAtBottom, handleLoadMore]);

  return (
    <>
      <AddPayment
        isOpen={isAddPaymentModalOpen}
        onClose={handleToggleAddPaymentModal}
        isBlockingInteraction={isBlockingInteraction}
        onPaymentAdded={handlePaymentAdded}
        initiativeId={initiativeId}
        activityId={null}
      />
      <FilterPayment
        isOpen={isFilterPaymentModalOpen}
        onClose={handleToggleFilterPaymentModal}
        isBlockingInteraction={isBlockingInteraction}
        onFilterApplied={handleFilterApplied}
        initiativeId={initiativeId}
        activityId={null}
      />
      {user ? (
        <div className={styles["transactionContainer"]}>
          {hasCreatePaymentPermission && (
            <button
              className={styles["saveButton"]}
              onClick={handleToggleAddPaymentModal}
            >
              Transactie toevoegen
            </button>
          )}
          <button
            className={styles["filterButton"]}
            onClick={handleToggleFilterPaymentModal}
          >
            Filter
          </button>
        </div>
      ) : null}
      <div className={styles.fundTransactionOverview} ref={sidePanelRef}>
        <table key={refreshTrigger} className={styles.fundTransactionTable}>
          <thead>
            <tr>
              <th>DATUM</th>
              <th>Activiteit</th>
              <th>ONTVANGER</th>
              <th>VERZENDER</th>
              <th>MEDIA</th>
              <th>BEDRAG</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 && !loadingMore ? (
              <tr>
                <td colSpan={6} className={styles["no-transactions"]}>
                  Geen transacties gevonden
                </td>
              </tr>
            ) : null}
            {transactions.map((transaction, index) => (
              <tr
                className={styles["transaction-row"]}
                key={index}
                onClick={() => handleEyeIconClick(transaction.id)}
              >
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
                        fontSize: "12px",
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
                        fontSize: "12px",
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
                  {isLoadingPermissions ? (
                    <LoadingCircle />
                  ) : (
                    <img
                      src={images.view}
                      alt="Eye Icon"
                      onClick={() => handleEyeIconClick(transaction.id)}
                      style={{ cursor: "pointer" }}
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
                <div className={styles["loading-container"]}>
                  <LoadingDot delay={0} />
                  <LoadingDot delay={0.1} />
                  <LoadingDot delay={0.1} />
                  <LoadingDot delay={0.2} />
                  <LoadingDot delay={0.2} />
                </div>
              ) : (
                <></>
              )}
            </button>
          </div>
        )}
        <PaymentDetails
          isOpen={isFetchPaymentDetailsModalOpen}
          onClose={handleToggleFetchPaymentDetailsModal}
          isBlockingInteraction={isBlockingInteraction}
          paymentId={selectedTransactionId}
          paymentData={editedTransaction}
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
          hasDeletePermission={hasDeletePermission}
          initiativeId={initiativeId}
          activityName={
            editedTransaction ? editedTransaction.activity_name : null
          }
        />
      </div>
    </>
  );
};

export default FundsTransactions;
