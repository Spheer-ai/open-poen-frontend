import React, { useState, useEffect } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import { FaPlus, FaMinus } from "react-icons/fa";
import CloseIson from "/close-icon.svg";

interface FilterPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  initiativeId: string;
  activityId: string | null;
  onFilterApplied: (filters: {
    startDate?: string;
    endDate?: string;
    minAmount?: string;
    maxAmount?: string;
    route?: string;
  }) => void;
}

const FilterPayment: React.FC<FilterPaymentProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  onFilterApplied,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const [dateOpen, setDateOpen] = useState(false);
  const [amountOpen, setAmountOpen] = useState(false);
  const [routeOpen, setRouteOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [selectedRoute, setSelectedRoute] = useState<string[]>([]);
  const [route, setRoute] = useState("");

  useEffect(() => {
    if (isOpen) {
      setModalIsOpen(true);
    } else {
      setTimeout(() => {
        setModalIsOpen(false);
      }, 300);
    }
  }, [isOpen]);

  const queryParams = {
    startDate,
    endDate,
    minAmount,
    maxAmount,
    route: selectedRoute.join(","),
  };

  const handleSave = async () => {
    try {
      const newQueryParams: {
        startDate?: string;
        endDate?: string;
        minAmount?: string;
        maxAmount?: string;
        route?: string;
      } = {};

      if (queryParams.startDate) {
        newQueryParams.startDate = queryParams.startDate;
      }

      if (queryParams.endDate) {
        newQueryParams.endDate = queryParams.endDate;
      }

      if (queryParams.minAmount !== "") {
        newQueryParams.minAmount = queryParams.minAmount.toString();
      }

      if (queryParams.maxAmount !== "") {
        newQueryParams.maxAmount = queryParams.maxAmount.toString();
      }

      if (queryParams.route) {
        newQueryParams.route = queryParams.route;
      }

      await onFilterApplied(newQueryParams);
      handleClose();
    } catch (error) {
      console.error("Error filter payment:", error);
    }
  };

  const handleClose = () => {
    if (!isBlockingInteraction) {
      setModalIsOpen(false);
      onClose();
    }
  };

  const toggleAccordion = (accordionKey) => {
    if (accordionKey === "date") setDateOpen(!dateOpen);
    if (accordionKey === "amount") setAmountOpen(!amountOpen);
    if (accordionKey === "route") setRouteOpen(!routeOpen);
  };

  const renderIcon = (isOpen) => {
    return isOpen ? (
      <FaMinus className={styles.accordionIcon} />
    ) : (
      <FaPlus className={styles.accordionIcon} />
    );
  };

  if (!isOpen && !modalIsOpen) {
    return null;
  }

  const handleClearFilters = () => {
    setStartDate("");
    setEndDate("");
    setMinAmount("");
    setMaxAmount("");
    setSelectedRoute([]);
    setRoute("");
    onFilterApplied({
      startDate: "",
      endDate: "",
      minAmount: "",
      maxAmount: "",
      route: "",
    });
  };

  const handleRouteCheckboxChange = (value) => {
    const updatedRoute = selectedRoute.includes(value) ? [] : [value];
    setSelectedRoute(updatedRoute);
  };

  return (
    <>
      <div
        className={`${styles.backdrop} ${modalIsOpen ? styles.open : ""}`}
        onClick={handleClose}
      ></div>
      <div className={`${styles.modal} ${modalIsOpen ? styles.open : ""}`}>
        <div className={styles.formTop}>
          <h2 className={styles.title}>Resultaten filteren op</h2>
          <button onClick={handleClose} className={styles.closeBtn}>
            <img src={CloseIson} alt="" />
          </button>
        </div>
        <hr />
        <div className={styles.formGroup}>
          <div className={styles.accordionItem}>
            <button
              className={styles.accordionHeader}
              onClick={() => toggleAccordion("date")}
            >
              Datum {renderIcon(dateOpen)}
            </button>
            {dateOpen && (
              <div className={styles.accordionContent}>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            )}
          </div>
          <hr></hr>
          <div className={styles.accordionItem}>
            <button
              className={styles.accordionHeader}
              onClick={() => toggleAccordion("amount")}
            >
              Bedrag {renderIcon(amountOpen)}
            </button>
            {amountOpen && (
              <div className={styles.accordionContent}>
                <input
                  type="number"
                  placeholder="Min Bedrag"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Max Bedrag"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                />
              </div>
            )}
          </div>
          <hr></hr>
          <div className={styles.accordionItem}>
            <button
              className={styles.accordionHeader}
              onClick={() => toggleAccordion("route")}
            >
              Route {renderIcon(routeOpen)}
            </button>
            {routeOpen && (
              <div className={styles.accordionCheck}>
                <label htmlFor="inkomen">
                  <input
                    type="checkbox"
                    id="inkomen"
                    name="inkomen"
                    value="inkomen"
                    checked={selectedRoute.includes("inkomen")}
                    onChange={() => handleRouteCheckboxChange("inkomen")}
                  />
                  Inkomen
                </label>
                <label htmlFor="uitgaven">
                  <input
                    type="checkbox"
                    id="uitgaven"
                    name="uitgaven"
                    value="uitgaven"
                    checked={selectedRoute.includes("uitgaven")}
                    onChange={() => handleRouteCheckboxChange("uitgaven")}
                  />
                  Uitgaven
                </label>
              </div>
            )}
          </div>
          <hr></hr>
        </div>
        <div className={styles.buttonContainer}>
          <button onClick={handleClearFilters} className={styles.clearButton}>
            Wis filters
          </button>
          <button onClick={handleClose} className={styles.cancelButton}>
            Annuleren
          </button>
          <button onClick={handleSave} className={styles.saveButton}>
            Opslaan
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterPayment;
