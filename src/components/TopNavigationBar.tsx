import React from "react";
import styles from "./TopNavigationBar.module.scss";
import Search from "./Search";

interface TopNavigationBarProps {
  title: string;
  showSettings: boolean;
  showCta: boolean;
  onSettingsClick?: () => void;
  onCtaClick?: () => void;
  onSearch: (query: string) => void;
}

const TopNavigationBar: React.FC<TopNavigationBarProps> = ({
  title,
  showSettings,
  onSettingsClick,
  showCta,
  onCtaClick,
  onSearch,
}) => {
  return (
    <div className={styles["top-navigation-bar"]}>
      <div className={styles["bar-items"]}>
        <div className={styles["title"]}>
          <h2>{title}</h2>
        </div>
        <div className={styles["icons"]}>
          {showSettings && (
            <div className={styles["settings-icon"]} onClick={onSettingsClick}>
              <img src="/profile-settings.svg" alt="Profile Settings" />
            </div>
          )}
          {showCta && (
            <div className={styles["cta-button"]} onClick={onCtaClick}>
              <button className={styles["cta-button"]}>+</button>
            </div>
          )}
        </div>
      </div>
      <Search onSearch={onSearch} />
    </div>
  );
};

export default TopNavigationBar;
