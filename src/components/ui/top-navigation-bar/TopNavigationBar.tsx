import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

  // Responsive behavior: Logo for screens below 768px
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={styles["top-navigation-bar"]}>
      {windowWidth <= 768 && (
        <div className={styles["top-section"]}>
          <div className={styles["bar-items"]}>
            <Link to="/funds">
              <img
                className={styles["logo"]}
                src="/open-poen-logo-blue-mobile.svg"
                alt="Home Logo"
              />
            </Link>
            {showCta && hasPermission && (
              <div className={styles["cta-button"]} onClick={onCtaClick}>
                <button className={styles["cta-button"]}>+</button>
              </div>
            )}
          </div>
          <div className={styles["back-arrow-section"]}>
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
          </div>
        </div>
      )}
      {windowWidth > 768 && (
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
              <div
                className={styles["settings-icon"]}
                onClick={onSettingsClick}
              >
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
      )}
      {showSearch && <Search onSearch={onSearch} />}
    </div>
  );
};

export default TopNavigationBar;
