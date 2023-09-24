import { useState } from "react";
import SearchIcon from "/search-icon.svg";
import styles from "./Search.module.scss";

const Search = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className={styles["search-bar"]}>
      <div className={styles["search-icon"]}>
        <img src={SearchIcon} alt="Search Icon" />
      </div>

      <input
        type="text"
        placeholder="Zoekopdracht"
        value={query}
        onChange={handleInputChange}
        className={styles["search-input"]}
      />
    </div>
  );
};

export default Search;
