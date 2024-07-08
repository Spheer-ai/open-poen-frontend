import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../../../assets/scss/SidebarMenu.module.scss";
import { useAuth } from "../../../contexts/AuthContext";
import useCachedImages from "../../utils/images";

const SidebarMenu = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const images = useCachedImages([
    "funds",
    "users",
    "transactions",
    "sponsors",
    "login",
    "logout",
    "logoMain",
  ]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isLinkActive = (pathname) => {
    return location.pathname.startsWith(`/${pathname}`);
  };

  const linkData = [
    {
      name: "Funds",
      icon: images.funds,
      tooltip: "Initiatieven",
    },
    {
      name: "Contacts",
      icon: images.users,
      tooltip: "Gebruikers",
    },
  ];

  const authenticatedLinks = [
    {
      name: "Transactions",
      icon: images.transactions,
      tooltip: "Transacties",
    },
    {
      name: "Sponsors",
      icon: images.sponsors,
      tooltip: "Sponsors",
    },
  ];

  const isAuthenticated = !!user;

  return (
    <div className={styles["sidebar-menu"]}>
      {windowWidth <= 768 && (
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
              >
                <Link to={`/${linkInfo.name.toLowerCase()}`}>
                  <img
                    className={styles["sidebar-icon"]}
                    src={linkInfo.icon}
                    alt={`${linkInfo.name} Icon`}
                  />
                  <span className={styles["tooltip-text"]}>
                    {linkInfo.tooltip}
                  </span>
                </Link>
              </li>
            ))}
            {isAuthenticated && (
              <li
                className={isLinkActive("transactions") ? styles["active"] : ""}
              >
                <Link to="/transactions">
                  <img
                    className={styles["sidebar-icon"]}
                    src={images.transactions}
                    alt="Transactions Icon"
                  />
                  <span className={styles["tooltip-text"]}>Transacties</span>
                </Link>
              </li>
            )}
            {isAuthenticated && windowWidth > 768 && (
              <li className={isLinkActive("sponsors") ? styles["active"] : ""}>
                <Link to="/sponsors">
                  <img
                    className={styles["sidebar-icon"]}
                    src={images.sponsors}
                    alt="Sponsors Icon"
                  />
                  <span className={styles["tooltip-text"]}>Sponsors</span>
                </Link>
              </li>
            )}
            <li className={styles["login-logout-link"]}>
              <Link to={isAuthenticated ? "/" : "/login"}>
                <img
                  className={styles["hamburger-icon"]}
                  src={isAuthenticated ? images.login : images.logout}
                  alt={isAuthenticated ? "Logout Icon" : "Login Icon"}
                  onClick={logout}
                />
                <span className={styles["tooltip-text"]}>
                  {isAuthenticated ? "Logout" : "Login"}
                </span>
              </Link>
            </li>
          </ul>
        </div>
      )}

      {windowWidth > 768 && (
        <>
          <div className={styles["top-section"]}>
            <Link to="/funds">
              <img
                className={styles["logo"]}
                src={images.logoMain}
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
                      src={linkInfo.icon}
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
                        src={linkInfo.icon}
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
                src={isAuthenticated ? images.login : images.logout}
                alt={isAuthenticated ? "Logout Icon" : "Login Icon"}
                onClick={logout}
              />
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default SidebarMenu;
