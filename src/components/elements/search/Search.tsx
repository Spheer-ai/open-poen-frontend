import React, { useState } from "react";
import styles from "../../../assets/scss/Search.module.scss";
import useCachedImages from "../../utils/images";

const Search = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const images = useCachedImages(["search"]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className={styles["search-bar"]}>
      <div className={styles["search-icon"]}>
        <img src={images.search} alt="Search Icon" />
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
