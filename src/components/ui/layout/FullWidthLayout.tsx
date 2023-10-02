import React, { ReactNode } from "react";
import styles from "../../../assets/scss/FullWidthLayout.module.scss";

interface FullWidthLayoutProps {
  children: ReactNode;
}

export default function FullWidthLayout({ children }: FullWidthLayoutProps) {
  return <div className={styles["full-width-layout"]}>{children}</div>;
}
