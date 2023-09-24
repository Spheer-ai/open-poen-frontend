import React from "react";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./InlineModalLayout.module.scss";

interface InlineModalProps {
  children: ReactNode;
}

function InlineModalLayout({ children }: InlineModalProps) {
  const navigate = useNavigate();

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { navigate });
    }
    return child;
  });

  return (
    <div className={styles["inline-modal-layout"]}>{childrenWithProps}</div>
  );
}

export default InlineModalLayout;
