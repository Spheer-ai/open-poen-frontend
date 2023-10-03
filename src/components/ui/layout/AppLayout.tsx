import styles from "../../../assets/scss/AppLayout.module.scss";
import React, { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  <div className={styles["app-layout"]}>
    <div className={styles["content"]}>{children}</div>
  </div>;
}
