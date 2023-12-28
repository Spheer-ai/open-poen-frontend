import React from "react";
import styles from "../../../assets/scss/TopNavigationBar.module.scss";
import Search from "../../elements/search/Search";
import { TopNavigationBarProps } from "../../../types/TopNavigationBarType";

const TopNavigationBar: React.FC<TopNavigationBarProps> = ({
  title,
  showSettings,
  onSettingsClick,
  subtitle,
  subtitleStyle,
  showCta,
  onCtaClick,
  hasPermission,
  onSearch,
  onBackArrowClick,
  showSearch = true,
  onTitleClick = () => {},
}) => {
  const hasBackArrow = Boolean(onBackArrowClick);
  const handleTitleClick = () => {
    if (onTitleClick && typeof onTitleClick === "function") {
      onTitleClick();
    }
  };

  return (
    <div className={styles["top-navigation-bar"]}>
      <div className={styles["bar-items"]}>
        {onBackArrowClick && (
          <button onClick={onBackArrowClick} className={styles.backArrow}>
            <img src="/arrow-left.png" alt="Terug" />
          </button>
        )}
        <div
          className={
            hasBackArrow ? styles.titleWithArrow : styles.titleWithoutArrow
          }
          onClick={handleTitleClick}
        >
          <h2>{title}</h2>
          {subtitle && (
            <div className={styles.subtitle} style={subtitleStyle}>
              {subtitle}
            </div>
          )}
        </div>
        <div className={styles["icons"]}>
          {showSettings && (
            <div className={styles["settings-icon"]} onClick={onSettingsClick}>
              <img src="/profile-settings.svg" alt="Profile Settings" />
            </div>
          )}
          {showCta && hasPermission && (
            <div className={styles["cta-button"]} onClick={onCtaClick}>
              <button className={styles["cta-button"]}>+</button>
            </div>
          )}
        </div>
      </div>
      {showSearch && <Search onSearch={onSearch} />}
    </div>
  );
};

export default TopNavigationBar;
