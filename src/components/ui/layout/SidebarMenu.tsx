import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../../../assets/scss/SidebarMenu.module.scss";
import { useAuth } from "../../../contexts/AuthContext";

const SidebarMenu = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isLinkActive = (pathname) => {
    return location.pathname.startsWith(`/${pathname}`);
  };

  const linkData = [
    { name: "Funds", icon: "funds.svg", tooltip: "Initiatieven" },
    { name: "Contacts", icon: "contacts.svg", tooltip: "Gebruikers" },
  ];

  const authenticatedLinks = [
    { name: "Transactions", icon: "transactions.svg", tooltip: "Transacties" },
    { name: "Sponsors", icon: "sponsors.svg", tooltip: "Sponsors" },
  ];

  const isAuthenticated = !!user;

  return (
    <div className={styles["sidebar-menu"]}>
      <div className={styles["top-section"]}>
        <Link to="/funds">
          <img
            className={styles["logo"]}
            src="/open-poen-logo-blue.svg"
            alt="Home Logo"
          />
        </Link>
      </div>
      <div className={styles["middle-section"]}>
        <ul>
          {linkData.map((linkInfo) => (
            <li
              key={linkInfo.name}
              className={
                isLinkActive(linkInfo.name.toLowerCase())
                  ? styles["active"]
                  : ""
              }
              data-tooltip={linkInfo.tooltip}
            >
              <Link to={`/${linkInfo.name.toLowerCase()}`}>
                <img
                  className={styles["sidebar-icon"]}
                  src={`/${linkInfo.icon}`}
                  alt={`${linkInfo.name} Icon`}
                />
              </Link>
            </li>
          ))}
          {isAuthenticated &&
            authenticatedLinks.map((linkInfo) => (
              <li
                key={linkInfo.name}
                className={
                  isLinkActive(linkInfo.name.toLowerCase())
                    ? styles["active"]
                    : ""
                }
                data-tooltip={linkInfo.tooltip}
              >
                <Link to={`/${linkInfo.name.toLowerCase()}`}>
                  <img
                    className={styles["sidebar-icon"]}
                    src={`/${linkInfo.icon}`}
                    alt={`${linkInfo.name} Icon`}
                  />
                </Link>
              </li>
            ))}
        </ul>
      </div>
      <div className={styles["bottom-section"]}>
        <Link to={isAuthenticated ? "/" : "/login"}>
          <img
            className={styles["hamburger-icon"]}
            src={isAuthenticated ? "/logout.svg" : "/login.svg"}
            alt={isAuthenticated ? "Logout Icon" : "Login Icon"}
            onClick={logout}
          />
        </Link>
      </div>
    </div>
  );
};

export default SidebarMenu;
