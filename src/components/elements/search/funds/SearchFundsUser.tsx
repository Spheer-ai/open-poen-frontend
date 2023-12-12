import React, { useState, useEffect } from "react";
import { searchUsersByEmail } from "../../../middleware/Api";

interface SearchFundUsersProps {
  authToken: string;
  onSearchResult: (users: Array<{ id: number; email: string }>) => void;
}

const SearchFundUsers: React.FC<SearchFundUsersProps> = ({
  authToken,
  onSearchResult,
}) => {
  const [email, setEmail] = useState("");
  const [searchResults, setSearchResults] = useState<
    Array<{ id: number; email: string }>
  >([]);
  let timer: NodeJS.Timeout | null = null; // Initialize timer with null

  useEffect(() => {
    const handleSearch = async () => {
      try {
        const users = await searchUsersByEmail(authToken, email);
        setSearchResults(users);
        onSearchResult(users);
      } catch (error) {
        console.error("Error searching for users by email:", error);
      }
    };

    // Use a timer to delay the search after the user stops typing for 500 milliseconds
    if (email) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(handleSearch, 500);
    } else {
      // Clear search results if the input field is empty
      setSearchResults([]);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [email, authToken, onSearchResult]);

  return (
    <div>
      <h2>Search Fund Users</h2>
      <label>Email:</label>
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <div>
        <h3>Search Results:</h3>
        <ul>
          {searchResults.map((user) => (
            <li key={user.id}>
              ID: {user.id}, Email: {user.email}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchFundUsers;
