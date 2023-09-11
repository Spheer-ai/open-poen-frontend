import { Link, useLocation } from "react-router-dom";
import "./SidebarMenu.css";
import { logoutUser } from "./middleware/Api";

interface SidebarMenuProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

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
    <div className="sidebar-menu">
      <div className="top-section">
        <Link to="/funds">
          <img
            className="logo"
            src="/open-poen-logo-blue.svg"
            alt="Home Logo"
          />
        </Link>
      </div>
      <div className="middle-section">
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
                  className="sidebar-icon"
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
                    className="sidebar-icon"
                    src={`/${linkInfo.icon}`}
                    alt={`${linkInfo.name} Icon`}
                  />
                </Link>
              </li>
            ))}
        </ul>
      </div>
      <div className="bottom-section">
        <Link to={isAuthenticated ? "/" : "/login"}>
          <img
            className="hamburger-icon"
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
