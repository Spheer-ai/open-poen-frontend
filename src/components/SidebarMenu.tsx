import { Link, useLocation } from "react-router-dom";
import "./SidebarMenu.css";

const SidebarMenu = () => {
  const location = useLocation();

  const linkData = [
    { name: "Cards", icon: "cards.svg", tooltip: "Cards" },
    { name: "Contacts", icon: "contacts.svg", tooltip: "Contacts" },
    { name: "Funds", icon: "funds.svg", tooltip: "Funds" },
    { name: "Profile", icon: "profile.svg", tooltip: "Profile" },
    { name: "Transactions", icon: "transactions.svg", tooltip: "Transactions" },
    { name: "Tutors", icon: "tutors.svg", tooltip: "Tutors" },
  ];

  return (
    <div className="sidebar-menu">
      <div className="top-section">
        <Link to="/">
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
        </ul>
      </div>
      <div className="bottom-section">
        <img
          className="hamburger-icon"
          src="/hamburger.svg"
          alt="Hamburger Icon"
        />
      </div>
    </div>
  );
};

export default SidebarMenu;
