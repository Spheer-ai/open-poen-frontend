import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../../../assets/scss/layout/navigation/TabbedNavigation.module.scss";

interface Props {
  onTabChange: (tab: string) => void;
  initiativeId: string;
}

const TabbedFundNavigation: React.FC<Props> = ({
  onTabChange,
  initiativeId,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("transactieoverzicht");

  useEffect(() => {
    const tabFromPath = location.pathname.split("/").pop();
    if (tabFromPath === "transactieoverzicht") {
      setActiveTab("transactieoverzicht");
    } else if (tabFromPath === "activiteiten") {
      setActiveTab("activiteiten");
    } else if (tabFromPath === "details") {
      setActiveTab("details");
    } else if (tabFromPath === "sponsoren") {
      setActiveTab("sponsoren");
    } else if (tabFromPath === "media") {
      setActiveTab("media");
    } else if (tabFromPath === "gebruikers") {
      setActiveTab("gebruikers");
    }
  }, [location.pathname]);

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
    navigate(`/funds/${initiativeId}/${tabName}`);
    onTabChange(tabName);
  };

  return (
    <div className={styles["tab-fund-container"]}>
      <button
        className={activeTab === "transactieoverzicht" ? styles["active"] : ""}
        onClick={() => handleTabChange("transactieoverzicht")}
      >
        Transactieoverzicht
      </button>
      <button
        className={activeTab === "activiteiten" ? styles["active"] : ""}
        onClick={() => handleTabChange("activiteiten")}
      >
        Activiteiten
      </button>
      <button
        className={activeTab === "details" ? styles["active"] : ""}
        onClick={() => handleTabChange("details")}
      >
        Details
      </button>
      <button
        className={activeTab === "sponsoren" ? styles["active"] : ""}
        onClick={() => handleTabChange("sponsoren")}
      >
        Sponsoren
      </button>
      <button
        className={activeTab === "media" ? styles["active"] : ""}
        onClick={() => handleTabChange("media")}
      >
        Media
      </button>
      <button
        className={activeTab === "gebruikers" ? styles["active"] : ""}
        onClick={() => handleTabChange("gebruikers")}
      >
        Gebruikers
      </button>
    </div>
  );
};

export default TabbedFundNavigation;
