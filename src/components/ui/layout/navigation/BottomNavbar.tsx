import React from "react";
import { Link } from "react-router-dom";
import { SidebarMenuProps } from "../../../../types/SidebarMenuTypes";
import styles from "../../../../assets/scss/layout/navigation/BottomNavbar.module.scss"; // Create a separate CSS module for BottomNavbar styling

const BottomNavbar = ({ isAuthenticated, onLogout }: SidebarMenuProps) => {
  const handleLogout = async () => {
    // Handle logout logic
  };

  return (
    <div className={styles["bottom-navbar"]}>
      <div className={styles["bottom-navbar-content"]}>
        {isAuthenticated && (
          <>
            <Link to="/transactions" className={styles["navbar-link"]}>
              Transactions
            </Link>
            <Link to="/funds" className={styles["navbar-link"]}>
              Funds
            </Link>
            <Link to="/contacts" className={styles["navbar-link"]}>
              Contacts
            </Link>
            <Link to="/sponsors" className={styles["navbar-link"]}>
              Sponsors
            </Link>
          </>
        )}
        <Link to={isAuthenticated ? "/" : "/login"}>
          <img
            className={styles["logout-icon"]}
            src={isAuthenticated ? "/logout.svg" : "/login.svg"}
            alt={isAuthenticated ? "Logout Icon" : "Login Icon"}
            onClick={handleLogout}
          />
        </Link>
      </div>
    </div>
  );
};

export default BottomNavbar;
