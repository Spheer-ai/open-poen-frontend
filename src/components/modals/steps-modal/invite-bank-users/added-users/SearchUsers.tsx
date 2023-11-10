import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../../contexts/AuthContext";
import { searchUsersByEmail } from "../../../../middleware/Api";

interface SearchUsersProps {
  onAddUser: (user: { email: string; userId: number }) => void;
  updateSearchResults: (results: { email: string; userId: number }[]) => void;
  alreadyAddedEmails: { email: string; userId: number }[];
  searchResults: { email: string; userId: number }[];
}

const SearchUsers: React.FC<SearchUsersProps> = ({
  onAddUser,
  updateSearchResults,
  alreadyAddedEmails,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<
    {
      email: string;
      userId: number;
    }[]
  >([]);
  const { user } = useAuth();

  const fetchUsers = async () => {
    try {
      if (!user) {
        console.error("User not authenticated");
        return;
      }

      const response = await searchUsersByEmail(user.token, searchQuery);
      console.log("API Response:", response);

      const filteredResults = response.filter((result) => {
        const isAlreadyAdded = alreadyAddedEmails.some(
          (addedUser) => addedUser.email === result.email,
        );
        return !isAlreadyAdded;
      });

      const searchedEmailsAndIds = filteredResults.map((user) => ({
        email: user.email,
        userId: user.id,
      }));

      console.log("Searched Emails and IDs:", searchedEmailsAndIds);

      setSearchResults(searchedEmailsAndIds);
      updateSearchResults(searchedEmailsAndIds);
    } catch (error) {
      console.error("Error searching for users by email:", error);
    }
  };

  useEffect(() => {
    console.log("Search Query Changed:", searchQuery);

    const debounceTimeout = setTimeout(() => {
      if (searchQuery) {
        fetchUsers();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [searchQuery, user, updateSearchResults, alreadyAddedEmails]);

  const handleAddUser = (email: string, userId: number) => {
    onAddUser({ email, userId });
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <div style={{ padding: "0px 10px" }}>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by email..."
      />
      <ul style={{ padding: "10px", marginTop: "5px" }}>
        {searchResults.map((result, index) => (
          <li
            style={{ cursor: "pointer" }}
            key={index}
            onClick={() => handleAddUser(result.email, result.userId)}
          >
            {result.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchUsers;
