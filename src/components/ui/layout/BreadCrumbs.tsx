import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../../../assets/scss/layout/BreadCrumbs.module.scss";
import useCachedImages from "../../utils/images";

const Breadcrumb = ({ customBreadcrumbs }) => {
  const images = useCachedImages(["home"]);
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const isRootRoute = pathnames.length === 0;

  return (
    <nav>
      <ul className={styles.breadcrumbList}>
        <li className={styles.breadcrumbItem}>
          <Link to="/">
            <img src={images.home} alt="Home" />
          </Link>
        </li>
        {customBreadcrumbs
          ? customBreadcrumbs.map((breadcrumb, index) => (
              <li
                key={index}
                className={`${styles.breadcrumbItem} ${
                  index === customBreadcrumbs.length - 1
                    ? styles.lastBreadcrumb
                    : ""
                }`}
              >
                {index !== 0 && (
                  <>
                    <span className={styles.arrow}></span>
                    {breadcrumb}
                  </>
                )}
                {index === 0 && breadcrumb}
              </li>
            ))
          : pathnames.map((name, index) => {
              const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
              const isLast = index === pathnames.length - 1;
              const isActive = isLast ? styles.active : "";

              return (
                <li
                  key={name}
                  className={`${styles.breadcrumbItem} ${isActive} ${
                    isLast ? styles.lastBreadcrumb : ""
                  }`}
                >
                  {index !== 0 && (
                    <>
                      <span className={styles.arrow}></span>
                      <Link to={routeTo}>{name}</Link>
                    </>
                  )}
                  {index === 0 && <Link to={routeTo}>{name}</Link>}
                </li>
              );
            })}
      </ul>
    </nav>
  );
};

export default Breadcrumb;
