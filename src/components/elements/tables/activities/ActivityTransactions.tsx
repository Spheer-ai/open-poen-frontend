import React, { useEffect, useRef, useState } from "react";
import { getPaymentsByActivity } from "../../../middleware/Api";
import styles from "../../../../assets/scss/TransactionOverview.module.scss";
import PaymentDetails from "../../../modals/PaymentDetails";
import ViewIcon from "/eye.svg";
import { useNavigate } from "react-router-dom";
import EditPayment from "../../../modals/EditPayment";
import AddPayment from "../../../modals/AddPayment";
import { usePermissions } from "../../../../contexts/PermissionContext";
import { useAuth } from "../../../../contexts/AuthContext";
import LoadingDot from "../../../animation/LoadingDot";
import LoadingCircle from "../../../animation/LoadingCircle";
import { useFieldPermissions } from "../../../../contexts/FieldPermissionContext";
import FilterPayment from "../../../modals/FilterPayment";

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

const ActivityTransactions: React.FC<{
  authToken: string;
  initiativeId: string;
  activityId: string;
  activity_name: string;
  onRefreshTrigger: () => void;
  entityPermissions: string[];
  hasCreatePaymentPermission: boolean;
}> = ({
  authToken,
  initiativeId,
  activityId,
  activity_name,
  onRefreshTrigger,
  hasCreatePaymentPermission,
}) => {
  const { user } = useAuth();
  const { fetchPermissions } = usePermissions();
  const [hasEditPermission, setHasEditPermission] = useState<
    boolean | undefined
  >(false);
  const [hasReadPermission, setHasReadPermission] = useState<
    boolean | undefined
  >(false);
  const [hasDeletePermission, setHasDeletePermission] = useState<
    boolean | undefined
  >(false);
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    number | null
  >(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isBlockingInteraction, setIsBlockingInteraction] = useState(false);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
  const { fetchFieldPermissions } = useFieldPermissions();
  const [
    permissionsFetchedForTransaction,
    setPermissionsFetchedForTransaction,
  ] = useState<number | null>(null);
  const [isFetchPaymentDetailsModalOpen, setIsFetchPaymentDetailsModalOpen] =
    useState(false);
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const [isFilterPaymentModalOpen, setIsFilterPaymentModalOpen] =
    useState(false);
  const [entityPermissions, setEntityPermissions] = useState<string[]>([]);
  const [isEditPaymentModalOpen, setIsEditPaymentModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [editedTransaction, setEditedTransaction] =
    useState<Transaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreTransactions, setHasMoreTransactions] = useState(true);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [minAmount, setMinAmount] = useState<string>("");
  const [maxAmount, setMaxAmount] = useState<string>("");
  const [route, setRoute] = useState<string>("");
  const [pageSize] = useState(20);
  const [filterCriteria, setFilterCriteria] = useState({
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

  const handleFilterApplied = (filters) => {
    setStartDate(filters.startDate);
    setEndDate(filters.endDate);
    setMinAmount(filters.minAmount);
    setMaxAmount(filters.maxAmount);
    setRoute(filters.route);
    setCurrentPage(1);

    setFilterCriteria(filters);
  };

  const fetchTransactions = async () => {
    try {
      setLoadingMore(true);

      let queryParams: any = {
        offset: (currentPage - 1) * pageSize,
        limit: pageSize,
      };

      if (startDate) queryParams.start_date = startDate;
      if (endDate) queryParams.end_date = endDate;
      if (minAmount) queryParams.min_amount = minAmount;
      if (maxAmount) queryParams.max_amount = maxAmount;
      if (route) queryParams.route = route;

      const response = await getPaymentsByActivity(
        authToken,
        initiativeId,
        activityId,
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
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMoreTransactions) {
      setCurrentPage((prevPage) => prevPage + 1);
      setFilterCriteria((prevCriteria) => ({
        ...prevCriteria,
        startDate: "",
        endDate: "",
        minAmount: "",
        maxAmount: "",
        route: "",
      }));
    }
  };

  const handleEyeIconClick = async (transactionId: number) => {
    setIsLoadingPermissions(true);

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

      const hasDeletePermission =
        userPermissions && userPermissions.includes("delete");
      setHasDeletePermission(hasDeletePermission);

      setPermissionsFetchedForTransaction(transactionId);

      if (hasEditPermission) {
        handleTransactionEditClick(transactionId);
      } else {
        handleTransactionDetailsClick(transactionId);
      }
    } catch (error) {
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
        navigate(`/funds/${initiativeId}/activities/${activityId}`);
      }, 300);
    } else {
      setIsFetchPaymentDetailsModalOpen(true);
      navigate(`/funds/${initiativeId}/activities/${activityId}/details`);
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
        navigate(`/funds/${initiativeId}/activities/${activityId}`);
      }, 300);
    } else {
      setIsAddPaymentModalOpen(true);
      navigate(`/funds/${initiativeId}/activities/${activityId}/add-payment`);
    }
  };

  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchTransactions();
    }
  }, [refreshTrigger]);

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
        navigate(`/funds/${initiativeId}/activities/${activityId}`);
      }, 300);
    } else {
      setIsFilterPaymentModalOpen(true);
      navigate(
        `/funds/${initiativeId}/activities/${activityId}/filter-payment`,
      );
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
  }, [isAtBottom]);

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
      <FilterPayment
        isOpen={isFilterPaymentModalOpen}
        onClose={handleToggleFilterPaymentModal}
        isBlockingInteraction={isBlockingInteraction}
        onFilterApplied={handleFilterApplied}
        initiativeId={initiativeId}
        activityId={activityId}
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
              <th>BESCHRIJVING</th>
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
                  <div>{transaction.short_user_description}</div>
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
                <td>
                  {isLoadingPermissions ? (
                    <LoadingCircle />
                  ) : (
                    <img
                      src={ViewIcon}
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
          activityName={activity_name}
          initiativeId={initiativeId}
        />
      </div>
    </>
  );
};

export default ActivityTransactions;
