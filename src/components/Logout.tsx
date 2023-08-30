import React from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "./middleware/Api";

interface LogoutProps {
  onLogout: () => void;
  token: string;
}

const Logout: React.FC<LogoutProps> = ({ onLogout, token }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Perform the logout action using the API and pass the token
      await logoutUser(token);

      // Clear any user-related data from the application (e.g., token, user info)

      // Call the onLogout callback
      onLogout();

      // Redirect to the login page or any other desired page
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Logout
    </button>
  );
};

export default Logout;
