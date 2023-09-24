import styles from "./AppLayout.module.scss";

import { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  <div className={styles["app-layout"]}>
    <div className={styles["content"]}>{children}</div>
  </div>;
}

export default AppLayout;
