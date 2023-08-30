import React from "react";
import "./TopNavigationBar.css";

interface TopNavigationBarProps {
  title: string;
  showSettings: boolean;
  showCta: boolean;
  onSettingsClick?: () => void;
  onCtaClick?: () => void;
}

const TopNavigationBar: React.FC<TopNavigationBarProps> = ({
  title,
  showSettings,
  onSettingsClick,
  showCta,
  onCtaClick,
}) => {
  return (
    <div className="top-navigation-bar">
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
  );
};

export default TopNavigationBar;
