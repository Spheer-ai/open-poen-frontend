import React, { useState, useEffect } from "react";
import { searchUsersByEmail } from "../../../middleware/Api";

interface SearchFundUsersProps {
  authToken: string;
  onUserClick: (user: { id: number; email: string }) => void;
}

const SearchFundUsers: React.FC<SearchFundUsersProps> = ({
  authToken,
  onUserClick,
}) => {
  const [email, setEmail] = useState("");
  const [searchResults, setSearchResults] = useState<
    Array<{ id: number; email: string }>
  >([]);
  let timer: NodeJS.Timeout | null = null;

  useEffect(() => {
    const handleSearch = async () => {
      try {
        const users = await searchUsersByEmail(authToken, email);
        setSearchResults(users);
      } catch (error) {
        console.error("Error searching for users by email:", error);
      }
    };

    if (email) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(handleSearch, 500);
    } else {
      setSearchResults([]);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [email, authToken]);

  const handleUserClick = (user: { id: number; email: string }) => {
    onUserClick(user);
  };

  return (
    <div>
      <h3>Activiteitnemers beheren</h3>
      <label>Email:</label>
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <ul>
        {searchResults.map((user) => (
          <li key={user.id} onClick={() => handleUserClick(user)}>
            E-mailadres: {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchFundUsers;
