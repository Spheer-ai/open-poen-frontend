import React from "react";
import "./TopNavigationBar.css";
import Search from "./Search"; // Import the Search component

interface TopNavigationBarProps {
  title: string;
  showSettings: boolean;
  showCta: boolean;
  onSettingsClick?: () => void;
  onCtaClick?: () => void;
  onSearch: (query: string) => void; // Add a prop for the search callback
}

const TopNavigationBar: React.FC<TopNavigationBarProps> = ({
  title,
  showSettings,
  onSettingsClick,
  showCta,
  onCtaClick,
  onSearch, // Pass the onSearch prop
}) => {
  return (
    <div className="top-navigation-bar">
      <div className="bar-items">
        <div className="title">
          <h2>{title}</h2>
        </div>
        <div className="icons">
          {showSettings && (
            <div className="settings-icon" onClick={onSettingsClick}>
              <img src="/profile-settings.svg" alt="Profile Settings" />
            </div>
          )}
          {showCta && (
            <div className="cta-button" onClick={onCtaClick}>
              <button className="cta-button">+</button>
            </div>
          )}
        </div>
      </div>
      <Search onSearch={onSearch} />
    </div>
  );
};

export default TopNavigationBar;
