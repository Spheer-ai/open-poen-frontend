import { ReactNode } from "react";
import styles from "./FullWidthLayout.module.scss";

interface FullWidthLayoutProps {
  children: ReactNode;
}

function FullWidthLayout({ children }: FullWidthLayoutProps) {
  return <div className={styles["full-width-layout"]}>{children}</div>;
}

export default FullWidthLayout;
