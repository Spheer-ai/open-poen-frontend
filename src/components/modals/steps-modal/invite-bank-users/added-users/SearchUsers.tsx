import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../../contexts/AuthContext";
import { searchUsersByEmail } from "../../../../middleware/Api";

interface SearchUsersProps {
  onAddUser: (user: { email: string; userId: number }) => void;
}

const SearchUsers: React.FC<SearchUsersProps> = ({ onAddUser }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<
    { email: string; userId: number }[]
  >([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!user) {
          console.error("User not authenticated");
          return;
        }

        const response = await searchUsersByEmail(user.token, searchQuery);
        console.log("API Response:", response);

        const searchedEmailsAndIds = response.map((user) => ({
          email: user.email,
          userId: user.id,
        }));

        setSearchResults(searchedEmailsAndIds);
      } catch (error) {
        console.error("Error searching for users by email:", error);
      }
    };

    fetchUsers();
  }, [searchQuery, user]);

  const handleAddUser = (email: string, userId: number) => {
    onAddUser({ email, userId });
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by email..."
      />
      <ul>
        {searchResults.map((result, index) => (
          <li
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
