import React from "react";
import AppRoutes from "./routes/Routes";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider as AppAuthProvider } from "./contexts/AuthContext";
import { IntlProvider } from "react-intl";
import { messages } from "./locale/messages";
import { getLocale } from "./locale/locale";
import PermissionProvider from "./contexts/PermissionProvider";
import FieldPermissionProvider from "./contexts/FieldPermissionProvider";

export default function App() {
  const locale = getLocale();

  return (
    <AppAuthProvider>
      <PermissionProvider>
        <FieldPermissionProvider>
          <Router>
            <IntlProvider
              locale={locale}
              messages={messages[locale] || messages["nl"]}
            >
              <div>
                <AppRoutes />
              </div>
            </IntlProvider>
          </Router>
        </FieldPermissionProvider>
      </PermissionProvider>
    </AppAuthProvider>
  );
}
