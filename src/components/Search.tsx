import React, { useState } from "react";
import SearchIcon from "/search-icon.svg"; // Import the search icon SVG

const Search = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); // Call onSearch with the updated query value
  };

  return (
    <div className="search-bar">
      {/* Search icon */}
      <div className="search-icon">
        <img src={SearchIcon} alt="Search Icon" />
      </div>

      <input
        type="text"
        placeholder="Zoekopdracht"
        value={query}
        onChange={handleInputChange}
        className="search-input"
      />
    </div>
  );
};

export default Search;
