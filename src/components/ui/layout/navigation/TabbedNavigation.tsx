import React from "react";
import styles from "../../../../assets/scss/layout/navigation/TabbedNavigation.module.scss";

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TabbedNavigation: React.FC<Props> = ({ activeTab, onTabChange }) => {
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
