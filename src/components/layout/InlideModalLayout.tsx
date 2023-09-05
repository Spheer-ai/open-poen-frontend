// InlineModalLayout.tsx
import { ReactNode } from "react";

interface InlineModalProps {
  children: ReactNode;
}

function InlineModalLayout({ children }: InlineModalProps) {
  return <div className="inline-modal-layout">{children}</div>;
}

export default InlineModalLayout;
