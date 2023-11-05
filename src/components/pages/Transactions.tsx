import React, { useState, useEffect } from "react";
import styles from "../../assets/scss/Transactions.module.scss";
import { useNavigate, useLocation } from "react-router-dom";
import TabbedNavigation from "../ui/layout/navigation/TabbedNavigation";
import BankConnections from "../lists/BankConnections";

export default function Transactions() {
  const [activeTab, setActiveTab] = useState("transactieoverzicht");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("/transactions/bankconnections")) {
      setActiveTab("banken");
    }
  }, [location.pathname]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);

    if (tabName === "banken") {
      navigate("/transactions/bankconnections");
    }
    if (tabName === "transactieoverzicht") {
      navigate("/transactions");
    }
  };

  return (
    <>
      <div className={styles["transaction-container"]}>
        <h2>Transacties</h2>
        <TabbedNavigation onTabChange={handleTabChange} />
        {activeTab === "transactieoverzicht" && <>Transactieoverzicht</>}
        {activeTab === "banken" && <BankConnections />}
      </div>
    </>
  );
}
