import { Link, useLocation } from "react-router-dom";
import styles from "../../../assets/scss/SidebarMenu.module.scss";
import { logoutUser } from "../../middleware/Api";
import { SidebarMenuProps } from "../../../types/SideBarMenuTypes";

const SidebarMenu = ({ isAuthenticated, onLogout }: SidebarMenuProps) => {
  const location = useLocation();

  const linkData = [
    { name: "Funds", icon: "funds.svg", tooltip: "Funds" },
    { name: "Contacts", icon: "contacts.svg", tooltip: "Contacts" },
  ];

  const authenticatedLinks = [
    { name: "Transactions", icon: "transactions.svg", tooltip: "Transactions" },
    { name: "Sponsors", icon: "sponsors.svg", tooltip: "Sponsors" },
  ];

  const handleLogout = async () => {
    if (isAuthenticated) {
      try {
        const token = localStorage.getItem("token") ?? "";
        await logoutUser(token);
        localStorage.removeItem("token");
        onLogout();
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
  };

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
                location.pathname === `/${linkInfo.name.toLowerCase()}`
                  ? "active"
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
                  location.pathname === `/${linkInfo.name.toLowerCase()}`
                    ? "active"
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
            onClick={handleLogout}
          />
        </Link>
      </div>
    </div>
  );
};

export default SidebarMenu;
