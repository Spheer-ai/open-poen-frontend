// FullWidthLayout.tsx
import React, { ReactNode } from "react";

interface FullWidthLayoutProps {
  children: ReactNode;
}

function FullWidthLayout({ children }: FullWidthLayoutProps) {
  return <div className="full-width-layout">{children}</div>;
}

export default FullWidthLayout;
