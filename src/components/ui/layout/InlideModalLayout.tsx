import React, { ReactNode } from "react";
import { NavigateFunction } from "react-router-dom";
import styles from "../../../assets/scss/InlineModalLayout.module.scss";

interface InlineModalProps {
  children: ReactNode;
  navigate: NavigateFunction;
}

export default function InlineModalLayout({
  children,
  navigate,
}: InlineModalProps) {
  return (
    <div className={styles["inline-modal-layout"]}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement, { navigate })
          : child,
      )}
    </div>
  );
}
