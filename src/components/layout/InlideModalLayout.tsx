import React from "react";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface InlineModalProps {
  children: ReactNode;
}

function InlineModalLayout({ children }: InlineModalProps) {
  const navigate = useNavigate(); // Use navigate instead of routerNavigate

  // Pass navigate down to children
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { navigate }); // Pass navigate as a prop
    }
    return child;
  });

  return <div className="inline-modal-layout">{childrenWithProps}</div>;
}

export default InlineModalLayout;
