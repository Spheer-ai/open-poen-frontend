import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../../assets/scss/BankList.module.scss";
import AddBankConnectionModal from "../modals/AddBankConnectionModal";

const BankConnections = () => {
  const bankConnections = [
    { id: 1, name: "Bank 1" },
    { id: 2, name: "Bank 2" },
    { id: 3, name: "Bank 3" },
  ];

  const [isBlockingInteraction, setIsBlockingInteraction] = useState(false);
  const [isAddBankConnectionModalOpen, setIsAddBankConnectionModalOpen] =
    useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/transactions/bankconnections/add-bank") {
      setIsAddBankConnectionModalOpen(true);
    }
  }, [location.pathname]);

  const handleToggleAddBankModal = () => {
    if (isAddBankConnectionModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsAddBankConnectionModalOpen(false);
        navigate(`/transactions/bankconnections`);
      }, 300);
    } else {
      setIsAddBankConnectionModalOpen(true);
      navigate(`/transactions/bankconnections/add-bank`);
    }
  };

  return (
    <div className={styles["bank-connections-container"]}>
      <h2 className={styles["title"]}>Bank Connections</h2>
      <ul>
        {bankConnections.map((connection) => (
          <li key={connection.id} className={styles["bank-item"]}>
            <span className={styles["bank-name"]}>{connection.name}</span>
          </li>
        ))}
      </ul>
      <button
        className={styles["saveButton"]}
        onClick={handleToggleAddBankModal}
      >
        Add Bank Connection
      </button>
      <AddBankConnectionModal
        isOpen={isAddBankConnectionModalOpen}
        onClose={handleToggleAddBankModal}
        isBlockingInteraction={isBlockingInteraction}
      />
    </div>
  );
};

export default BankConnections;
