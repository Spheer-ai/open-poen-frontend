import React, { useState } from "react";
import styles from "../../../../assets/scss/TransactionOverview.module.scss";

const TransactionSearchInput = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className={styles["transaction-search-container"]}>
      <input
        className={styles["transaction-search-input"]}
        type="text"
        placeholder="Zoekopdracht"
        value={searchQuery}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default TransactionSearchInput;
