import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { IntlProvider } from "react-intl";
import messages from "./lang/nl/messages.json";
import "./assets/scss/global/index.module.scss";

const locale = "en";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <IntlProvider locale={locale} messages={messages}>
      <App />
    </IntlProvider>
  </React.StrictMode>,
);
