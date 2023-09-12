import { useState, useEffect } from "react";
import SidebarMenu from "../components/SidebarMenu";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Contacts from "../components/pages/Contacts";
import Funds from "../components/pages/Funds";
import Profile from "../components/pages/profile/Profile";
import Transactions from "../components/pages/Transactions";
import Login from "../components/pages/Login";
import Sponsors from "../components/pages/Sponsors";
import InlineModalLayout from "../components/layout/InlideModalLayout";
import FullWidthLayout from "../components/layout/FullWidthLayout";
import LoginModal from "../components/modals/LoginModal";
import "./Routes.css";

function AppRoutes() {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Function to handle user login
  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate("/profile");
    setShowLoginModal(false);
  };

  // Function to handle user logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate("/funds");
  };

  // Function to hide the login modal
  const hideLogin = () => {
    setShowLoginModal(false);
  };

  const closeModal = () => {
    setShowLoginModal(false);
  };

  return (
    <div className="app-container">
      <SidebarMenu isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <div className="page-content">
        <Routes>
          <Route
            path="/"
            element={<InlineModalLayout>{<Funds />}</InlineModalLayout>}
          />
          <Route
            path="/contacts"
            element={<InlineModalLayout>{<Contacts />}</InlineModalLayout>}
          />
          <Route
            path="/funds"
            element={<InlineModalLayout>{<Funds />}</InlineModalLayout>}
          />
          <Route
            path="/profile"
            element={
              <FullWidthLayout>
                <Profile />
              </FullWidthLayout>
            }
          />
          {isAuthenticated && (
            <>
              <Route
                path="/transactions"
                element={
                  <InlineModalLayout>{<Transactions />}</InlineModalLayout>
                }
              />
              <Route
                path="/contacts"
                element={<InlineModalLayout>{<Contacts />}</InlineModalLayout>}
              />
              <Route
                path="/sponsors"
                element={<InlineModalLayout>{<Sponsors />}</InlineModalLayout>}
              />
            </>
          )}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/profile" />
              ) : (
                <Login onLogin={handleLogin} onClose={closeModal} />
              )
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
      {showLoginModal && (
        <LoginModal onClose={hideLogin} onLogin={handleLogin} />
      )}{" "}
    </div>
  );
}

export default AppRoutes;
