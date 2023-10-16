import React, { useState } from "react";
import { usePermissions } from "../../contexts/PermissionContext";
import { useAuth } from "../../contexts/AuthContext"; // <-- Import the useAuth hook

const PermissionChecker: React.FC = () => {
  const [userId, setUserId] = useState<string>("");
  const [fetchedPermissions, setFetchedPermissions] = useState<string[]>([]);
  const { fetchPermissions } = usePermissions();
  const { user } = useAuth();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(event.target.value);
  };

  const handleFetchPermissions = async () => {
    if (userId) {
      const parsedUserId = Number(userId);
      const tokenValue = user && user.token ? user.token : undefined;
      const permissions = await fetchPermissions(parsedUserId, tokenValue);

      if (permissions && permissions.length) {
        setFetchedPermissions(permissions);
      }
    }
  };
  return (
    <div>
      <input
        type="text"
        placeholder="Enter User ID"
        value={userId}
        onChange={handleInputChange}
      />
      <button onClick={handleFetchPermissions}>Fetch Permissions</button>

      <div>
        <h3>Fetched Permissions:</h3>
        <ul>
          {fetchedPermissions.map((permission, index) => (
            <li key={index}>{permission}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PermissionChecker;
