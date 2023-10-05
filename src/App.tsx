// App.tsx
import React from "react";
import AppRoutes from "./routes/Routes";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider as AppAuthProvider } from "./contexts/AuthContext";
import { IntlProvider } from "react-intl";
import { messages } from "./locale/messages";
import { getLocale } from "./locale/locale"; // Import the getLocale function

export default function App() {
  const locale = getLocale(); // Get the current locale

  return (
    <AppAuthProvider>
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
    </AppAuthProvider>
  );
}
