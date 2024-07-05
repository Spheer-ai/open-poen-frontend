import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import styles from "../../../assets/scss/TopNavigationBar.module.scss";
import Search from "../../elements/search/Search";
import { TopNavigationBarProps } from "../../../types/TopNavigationBarType";
import useCachedImage from "../../hooks/useCachedImage";

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
  showHomeLink = true,
  showTitleOnSmallScreen = true,
}) => {
  const hasBackArrow = Boolean(onBackArrowClick);
  const handleTitleClick = () => {
    if (onTitleClick && typeof onTitleClick === "function") {
      onTitleClick();
    }
  };
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

  const homeLogoSrc = useCachedImage(
    "/assets/images/logos/logo-openpoenmobile.svg",
  );
  const backArrowSrc = useCachedImage("/assets/images/icons/icon-return.svg");
  const settingsIconSrc = useCachedImage(
    "/assets/images/icons/icon-setting.svg",
  );

  console.log("Back Arrow Source:", backArrowSrc);

  return (
    <div className={styles["top-navigation-bar"]}>
      {windowWidth <= 768 && (
        <div className={styles["top-section"]}>
          <div className={styles["bar-items"]}>
            {showHomeLink && (
              <Link to="/funds">
                <img
                  className={styles["logo"]}
                  src={homeLogoSrc}
                  alt="Home Logo"
                />
              </Link>
            )}
            <div className={styles["back-arrow-section"]}>
              {onBackArrowClick && (
                <button onClick={onBackArrowClick} className={styles.backArrow}>
                  <img src={backArrowSrc} alt="Terug" />
                </button>
              )}
              {showTitleOnSmallScreen && (
                <div
                  className={
                    hasBackArrow
                      ? styles.titleWithArrow
                      : styles.titleWithoutArrow
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
              )}
            </div>
            {showCta && hasPermission && (
              <div className={styles["cta-button"]} onClick={onCtaClick}>
                <button className={styles["cta-button"]}>+</button>
              </div>
            )}
          </div>
        </div>
      )}
      {windowWidth > 768 && (
        <div className={styles["bar-items"]}>
          {onBackArrowClick && (
            <button onClick={onBackArrowClick} className={styles.backArrow}>
              <img src={backArrowSrc} alt="Terug" />
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
                <img src={settingsIconSrc} alt="Profile Settings" />
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
