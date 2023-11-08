import React from "react";
import { useLocation } from "react-router-dom";
import styles from "../../../../assets/scss/layout/navigation/TabbedNavigation.module.scss";

interface Props {
  onTabChange: (tab: string) => void;
}

const TabbedNavigation: React.FC<Props> = ({ onTabChange }) => {
  const location = useLocation();
  const activeTab = location.pathname.includes("/transactions/bankconnections")
    ? "banken"
    : "transactieoverzicht";

  return (
    <div className={styles["tab-container"]}>
      <button
        className={activeTab === "transactieoverzicht" ? styles["active"] : ""}
        onClick={() => onTabChange("transactieoverzicht")}
      >
        Transactieoverzicht
      </button>
      <button
        className={activeTab === "banken" ? styles["active"] : ""}
        onClick={() => onTabChange("banken")}
      >
        Banken
      </button>
    </div>
  );
};

export default TabbedNavigation;
