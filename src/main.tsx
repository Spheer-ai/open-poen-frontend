import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./assets/scss/global/index.module.scss";

const locale = "en";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
