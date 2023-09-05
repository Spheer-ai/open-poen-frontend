import React, { useState, useEffect } from "react";
import SidebarMenu from "../components/SidebarMenu";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "../components/pages/Home";
import Cards from "../components/pages/Cards";
import Contacts from "../components/pages/Contacts";
import Funds from "../components/pages/Funds";
import Profile from "../components/pages/profile/Profile";
import Transactions from "../components/pages/Transactions";
import Login from "../components/pages/Login";
import Tutors from "../components/pages/Tutors";
import InlineModalLayout from "../components/layout/InlideModalLayout";
import FullWidthLayout from "../components/layout/FullWidthLayout";
import "./Routes.css";

function AppRoutes() {
  // Get the current location using useLocation
  const location = useLocation();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if the current location is the login page
  const isLoginPage = location.pathname === "/login";

  useEffect(() => {
    // Check if the user is authenticated
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <div className="app-container">
      {!isLoginPage && <SidebarMenu />}
      <div className="page-content">
        <Routes>
          <Route
            path="/"
            element={
              <InlineModalLayout>
                <Profile />
              </InlineModalLayout>
            }
          />
          <Route
            path="/cards"
            element={
              <InlineModalLayout>
                <Cards />
              </InlineModalLayout>
            }
          />
          <Route
            path="/contacts"
            element={
              <InlineModalLayout>
                <Contacts />
              </InlineModalLayout>
            }
          />
          <Route
            path="/funds"
            element={
              <InlineModalLayout>
                <Funds />
              </InlineModalLayout>
            }
          />

          <Route
            path="/profile"
            element={
              <FullWidthLayout>
                <Profile />
              </FullWidthLayout>
            }
          />
          <Route
            path="/transactions"
            element={
              <InlineModalLayout>
                <Transactions />
              </InlineModalLayout>
            }
          />
          <Route
            path="/tutors"
            element={
              <InlineModalLayout>
                <Tutors />
              </InlineModalLayout>
            }
          />

          <Route
            path="/login"
            element={
              <Login
                onLogin={handleLogin}
                isAuthenticated={isAuthenticated}
                onLogout={handleLogout}
              />
            }
          />

          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? "/profile" : "/login"} />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default AppRoutes;
