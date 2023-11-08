import React, { ReactNode } from "react";
import { NavigateFunction } from "react-router-dom";
import styles from "../../../assets/scss/FullWidthLayout.module.scss";

interface FullWidthLayoutProps {
  children: ReactNode;
  navigate: NavigateFunction;
}

export default function FullWidthlLayout({
  children,
  navigate,
}: FullWidthLayoutProps) {
  return (
    <div className={styles["full-width-layout"]}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement, { navigate })
          : child,
      )}
    </div>
  );
}
