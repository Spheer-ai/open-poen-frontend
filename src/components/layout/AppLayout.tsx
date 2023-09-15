import React, { useEffect, useState } from "react";
import SidebarMenu from "../SidebarMenu";

import { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  <div className="app-layout">
    <div className="content">{children}</div>
  </div>;
}

export default AppLayout;
