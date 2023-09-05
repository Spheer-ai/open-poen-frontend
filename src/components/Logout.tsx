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

      await logoutUser(token);

      onLogout();

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
