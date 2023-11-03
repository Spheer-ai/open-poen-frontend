import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
      <h2>Bank Connections</h2>
      <button onClick={handleToggleAddBankModal}>Add Bank Connection</button>
      <ul>
        {bankConnections.map((connection) => (
          <li key={connection.id}>{connection.name}</li>
        ))}
      </ul>
      <AddBankConnectionModal
        isOpen={isAddBankConnectionModalOpen}
        onClose={handleToggleAddBankModal}
        isBlockingInteraction={isBlockingInteraction}
      />
    </div>
  );
};

export default BankConnections;
