import React, { useEffect } from "react";
import styles from "../../../assets/scss/layout/PageContent.module.scss";
import Breadcrumb from "./BreadCrumbs";

interface PageContentProps {
  children: React.ReactNode;
  showContent: boolean;
  onClose: () => void;
}

export default function PageContent({
  children,
  showContent,
  onClose,
}: PageContentProps) {
  useEffect(() => {
    const handleResize = () => {};

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className={`${styles["page-content-temp"]} ${
        showContent ? "" : styles["mobile-hidden"]
      }`}
    >
      <Breadcrumb />
      {children}
      {showContent && (
        <button onClick={onClose} className={styles["close-button"]}>
          Close PageContent
        </button>
      )}
    </div>
  );
}
