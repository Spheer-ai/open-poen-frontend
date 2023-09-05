// InlineModalLayout.tsx
import React, { ReactNode } from "react";

interface InlineModalProps {
  children: ReactNode;
}

function InlineModalLayout({ children }: InlineModalProps) {
  return <div className="inline-modal-layout">{children}</div>;
}

export default InlineModalLayout;
