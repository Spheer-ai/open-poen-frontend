import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../../assets/scss/TopNavigationBar.module.scss";
import Search from "../../elements/search/Search";
import { TopNavigationBarProps } from "../../../types/TopNavigationBarType";
import useCachedImages from "../../utils/images";

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
  const images = useCachedImages(["logoMobile", "return", "home", "search"]);
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

  return (
    <div className={styles["top-navigation-bar"]}>
      {windowWidth <= 768 && (
        <div className={styles["top-section"]}>
          <div className={styles["bar-items"]}>
            {showHomeLink && (
              <Link to="/funds">
                <img
                  className={styles["logo"]}
                  src={images.logoMobile}
                  alt="Home Logo"
                />
              </Link>
            )}
            <div className={styles["back-arrow-section"]}>
              {onBackArrowClick && (
                <button onClick={onBackArrowClick} className={styles.backArrow}>
                  <img src={images.return} alt="Terug" />
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
              <img src={images.return} alt="Terug" />
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
                <img src={images.settings} alt="Profile Settings" />
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
