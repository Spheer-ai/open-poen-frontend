import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../../../assets/scss/layout/BreadCrumbs.module.scss";

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const isRootRoute = pathnames.length === 0;

  return (
    <nav>
      <ul className={styles.breadcrumbList}>
        <li className={styles.breadcrumbItem}>
          <Link to="/">Home</Link>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          const isActive = isLast ? styles.active : "";

          return (
            <li key={name} className={`${styles.breadcrumbItem} ${isActive}`}>
              {isRootRoute && isLast ? (
                <span>{name}</span>
              ) : (
                <Link to={routeTo}>{name}</Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumb;
