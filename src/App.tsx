import React from "react";
import AppRoutes from "./routes/Routes";
import { BrowserRouter as Router } from "react-router-dom";
import "./general.css";

function App() {
  return (
    <Router>
      <div>
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
